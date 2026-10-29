#!/usr/bin/env node
/**
 * Validation sémantique Schema.org (types de propriétés), au-delà du JSON valide.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  failed += 1;
}

function asTypes(node) {
  if (!node || typeof node !== 'object') return [];
  const t = node['@type'];
  if (!t) return [];
  return Array.isArray(t) ? t.map(String) : [String(t)];
}

function hasType(node, allowed) {
  const types = asTypes(node);
  return types.some((t) => allowed.includes(t));
}

function assertPropType(label, parent, prop, allowedTypes) {
  if (!parent || parent[prop] == null) return;
  const value = parent[prop];
  const nodes = Array.isArray(value) ? value : [value];
  for (const node of nodes) {
    if (typeof node === 'string' || typeof node === 'number') continue;
    if (!hasType(node, allowedTypes)) {
      fail(
        `${label}.${prop} @type=${JSON.stringify(asTypes(node))} — attendu parmi ${allowedTypes.join('|')}`,
      );
    } else {
      ok(`${label}.${prop} → ${asTypes(node).join(',')}`);
    }
  }
}

const localBusinessSchema = require(path.join(root, 'src/_data/localBusinessSchema.js'));
const schema = typeof localBusinessSchema === 'function' ? localBusinessSchema() : localBusinessSchema;

if (!schema || typeof schema !== 'object') {
  fail('localBusinessSchema() ne renvoie pas un objet');
} else {
  ok('localBusinessSchema() chargeable');
}

if (schema.employee) {
  fail('localBusiness.employee présent — retirer ou n’utiliser que Person confirmée');
  assertPropType('LocalBusiness', schema, 'employee', ['Person']);
} else {
  ok('LocalBusiness sans employee (OK)');
}

if (schema.department) {
  assertPropType('LocalBusiness', schema, 'department', ['Organization']);
} else {
  ok('LocalBusiness sans department (OK — aucun département juridique confirmé)');
}

if (schema.aggregateRating || schema.review) {
  fail('aggregateRating/review auto-promotionnels interdits sur LocalBusiness');
} else {
  ok('Pas d’aggregateRating/review JSON-LD');
}

assertPropType('LocalBusiness', schema, 'geo', ['GeoCoordinates']);
assertPropType('LocalBusiness', schema, 'address', ['PostalAddress']);

const equipeSrc = fs.readFileSync(path.join(root, 'src/equipe.njk'), 'utf8');
if (/personSchema:/.test(equipeSrc) && /"@type":\s*"Person"/.test(equipeSrc)) {
  fail('equipe.njk : Person inventée détectée');
}
if (!/teamOrganizationSchema:/.test(equipeSrc)) {
  fail('equipe.njk : teamOrganizationSchema manquant');
} else {
  ok('equipe.njk expose teamOrganizationSchema');
}
if (
  /teamOrganizationSchema:[\s\S]*?"@type":\s*"Organization"/.test(equipeSrc) ||
  /teamOrganizationSchema:[\s\S]*?@type:\s*"Organization"/.test(equipeSrc)
) {
  ok('équipe page = Organization (pas employee LocalBusiness)');
} else {
  fail('teamOrganizationSchema doit être @type Organization');
}
if (/employee:/.test(equipeSrc)) {
  fail('equipe.njk ne doit pas définir employee');
}

const base = fs.readFileSync(path.join(root, 'src/_includes/base.njk'), 'utf8');
if (!base.includes('teamOrganizationSchema')) {
  fail('base.njk n’injecte pas teamOrganizationSchema');
} else {
  ok('base.njk injecte teamOrganizationSchema');
}

console.log('');
if (failed) {
  console.error(`Audit schema types : ${failed} échec(s)`);
  process.exit(1);
}
console.log('Audit schema types : OK');
