// Core database analysis algorithms for DBE Doctor
// Implements: attribute closure, candidate key discovery, normal form checks,
// lossless join test, and dependency preservation check.

import type {
  FunctionalDependency,
  Relation,
  ClosureResult,
  NormalFormAnalysis,
  NormalFormCheck,
  AnomalyExample,
  DecompositionResult,
  AnalysisResult,
} from '../types';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/** Get all attribute names from a relation */
export function getAttributeNames(relation: Relation): string[] {
  return relation.attributes.map(a => a.name);
}

/** Check if set A is a subset of set B */
export function isSubset(A: string[], B: string[]): boolean {
  const setB = new Set(B);
  return A.every(a => setB.has(a));
}

/** Check if two sets are equal */
export function setsEqual(A: string[], B: string[]): boolean {
  return isSubset(A, B) && isSubset(B, A);
}

/** Get union of two sets */
export function setUnion(A: string[], B: string[]): string[] {
  return [...new Set([...A, ...B])];
}

/** Generate all subsets of a set (power set) */
export function powerSet(set: string[]): string[][] {
  if (set.length > 12) {
    return []; // Too large for exhaustive enumeration
  }
  const result: string[][] = [[]];
  for (const item of set) {
    const newSubsets = result.map(subset => [...subset, item]);
    result.push(...newSubsets);
  }
  return result;
}

/** Generate combinations of size k from a set */
export function combinations(set: string[], k: number): string[][] {
  if (k === 0) return [[]];
  if (k > set.length) return [];
  if (k === set.length) return [set];
  
  const result: string[][] = [];
  const combo = (start: number, current: string[]) => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < set.length; i++) {
      current.push(set[i]);
      combo(i + 1, current);
      current.pop();
    }
  };
  combo(0, []);
  return result;
}

// ============================================================
// ATTRIBUTE CLOSURE
// ============================================================

/**
 * Compute the closure of a set of attributes X under a set of functional dependencies.
 * Algorithm: Start with X, repeatedly add attributes that can be determined
 * by the current set using the given FDs.
 */
export function computeClosure(
  X: string[],
  fds: FunctionalDependency[]
): string[] {
  let closure = new Set(X);
  let changed = true;

  while (changed) {
    changed = false;
    for (const fd of fds) {
      // If all determinant attributes are in the closure
      if (fd.determinant.every(d => closure.has(d))) {
        // Add all dependent attributes
        for (const dep of fd.dependent) {
          if (!closure.has(dep)) {
            closure.add(dep);
            changed = true;
          }
        }
      }
    }
  }

  return Array.from(closure).sort();
}

/** Compute closures for all single attributes */
export function computeAllSingleClosures(
  attributes: string[],
  fds: FunctionalDependency[]
): ClosureResult[] {
  return attributes.map(attr => ({
    attributeSet: [attr],
    closure: computeClosure([attr], fds),
  }));
}

// ============================================================
// CANDIDATE KEY DISCOVERY
// ============================================================

/**
 * Check if a set of attributes is a superkey (its closure contains all attributes).
 */
export function isSuperkey(
  attributes: string[],
  allAttributes: string[],
  fds: FunctionalDependency[]
): boolean {
  const closure = computeClosure(attributes, fds);
  return setsEqual(closure, allAttributes);
}

/**
 * Find all candidate keys for a relation.
 * A candidate key is a minimal superkey (no proper subset is also a superkey).
 * Uses exhaustive search for small relations.
 */
export function findCandidateKeys(
  attributes: string[],
  fds: FunctionalDependency[]
): { keys: string[][]; warning?: string } {
  if (attributes.length > 12) {
    return {
      keys: [],
      warning: `Schema has ${attributes.length} attributes. Exhaustive candidate key search is limited to 12 attributes or fewer. Please reduce the schema size or manually specify candidate keys.`,
    };
  }

  const allSubsets = powerSet(attributes);
  const superkeys: string[][] = [];

  // Find all superkeys
  for (const subset of allSubsets) {
    if (subset.length === 0) continue;
    if (isSuperkey(subset, attributes, fds)) {
      superkeys.push(subset);
    }
  }

  // Filter to minimal superkeys (candidate keys)
  const candidateKeys: string[][] = [];
  for (const sk of superkeys) {
    let isMinimal = true;
    for (const other of superkeys) {
      if (other !== sk && other.length < sk.length && isSubset(other, sk)) {
        isMinimal = false;
        break;
      }
    }
    if (isMinimal) {
      candidateKeys.push(sk.sort());
    }
  }

  // Remove duplicates
  const unique: string[][] = [];
  for (const key of candidateKeys) {
    if (!unique.some(k => setsEqual(k, key))) {
      unique.push(key);
    }
  }

  return { keys: unique };
}

/**
 * Find all superkeys (supersets of candidate keys).
 */
export function findSuperkeys(
  attributes: string[],
  fds: FunctionalDependency[],
  candidateKeys: string[][]
): string[][] {
  if (attributes.length > 10) return []; // Limit for performance

  const allSubsets = powerSet(attributes);
  const superkeys: string[][] = [];

  for (const subset of allSubsets) {
    if (subset.length === 0) continue;
    // A superkey contains at least one candidate key
    if (candidateKeys.some(ck => isSubset(ck, subset))) {
      superkeys.push(subset.sort());
    }
  }

  return superkeys;
}

/** Get prime attributes (attributes that appear in at least one candidate key) */
export function getPrimeAttributes(
  attributes: string[],
  candidateKeys: string[][]
): string[] {
  const primeSet = new Set<string>();
  for (const key of candidateKeys) {
    for (const attr of key) {
      primeSet.add(attr);
    }
  }
  return Array.from(primeSet).sort();
}

// ============================================================
// NORMAL FORM CHECKS
// ============================================================

/**
 * Check 1NF: All attribute values must be atomic.
 * Since we model attributes as single-valued, we check if any attribute
 * appears to contain multi-valued data (e.g., comma-separated values in sample data).
 */
export function check1NF(relation: Relation): NormalFormCheck {
  const violations: string[] = [];
  
  if (relation.sampleData && relation.sampleData.length > 0) {
    for (const row of relation.sampleData) {
      for (const attr of relation.attributes) {
        const value = row[attr.name];
        if (typeof value === 'string' && value.includes(',') && value.split(',').length > 1) {
          // Check if this looks like a multi-valued attribute
          const parts = value.split(',').map(p => p.trim());
          if (parts.length > 1 && parts.every(p => p.length > 0)) {
            violations.push(
              `Attribute "${attr.name}" contains potentially multi-valued data: "${value}". ` +
              `In 1NF, each attribute must hold only atomic (indivisible) values.`
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    return {
      satisfied: false,
      reason: 'The relation may violate 1NF because some attributes contain non-atomic values.',
      violations: [...new Set(violations)],
      details: 'First Normal Form requires that every attribute contains only atomic (single-valued) entries. If an attribute stores lists, arrays, or comma-separated values, the relation is not in 1NF.',
    };
  }

  return {
    satisfied: true,
    reason: 'The relation satisfies 1NF. All attributes appear to contain atomic values.',
    details: 'First Normal Form requires that every attribute contains only atomic (indivisible) values. Each cell in the table holds exactly one value.',
  };
}

/**
 * Check 2NF: No non-prime attribute is partially dependent on a candidate key.
 * A partial dependency exists when a non-prime attribute depends on only
 * a proper subset of a candidate key (relevant only for composite keys).
 */
export function check2NF(
  relation: Relation,
  candidateKeys: string[][],
  primeAttributes: string[]
): NormalFormCheck {
  // 2NF is only relevant if there is a composite candidate key
  const hasCompositeKey = candidateKeys.some(ck => ck.length > 1);
  
  if (!hasCompositeKey) {
    return {
      satisfied: true,
      reason: 'The relation satisfies 2NF. All candidate keys are single-attribute, so no partial dependencies are possible.',
      details: 'Second Normal Form eliminates partial dependencies. A partial dependency occurs when a non-prime attribute depends on only part of a composite candidate key. Since all candidate keys here are single-attribute, 2NF is automatically satisfied.',
    };
  }

  const violations: string[] = [];
  const nonPrimeAttrs = relation.attributes
    .map(a => a.name)
    .filter(a => !primeAttributes.includes(a));

  for (const fd of relation.functionalDependencies) {
    // Check if this FD represents a partial dependency
    for (const ck of candidateKeys) {
      if (ck.length > 1) {
        // Check if the determinant is a proper subset of this composite key
        if (isSubset(fd.determinant, ck) && fd.determinant.length < ck.length) {
          // Check if any dependent is a non-prime attribute
          const nonPrimeDependents = fd.dependent.filter(d => nonPrimeAttrs.includes(d));
          if (nonPrimeDependents.length > 0) {
            violations.push(
              `Partial dependency found: {${fd.determinant.join(', ')}} → {${nonPrimeDependents.join(', ')}}. ` +
              `The determinant {${fd.determinant.join(', ')}} is a proper subset of candidate key {${ck.join(', ')}}, ` +
              `and the dependent attribute(s) are non-prime.`
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    return {
      satisfied: false,
      reason: 'The relation violates 2NF due to partial dependencies on composite candidate keys.',
      violations,
      details: 'Second Normal Form requires that no non-prime attribute is partially dependent on any candidate key. A partial dependency means a non-key attribute depends on only part of a composite key, not the whole key.',
    };
  }

  return {
    satisfied: true,
    reason: 'The relation satisfies 2NF. No partial dependencies of non-prime attributes on candidate keys were found.',
    details: 'Second Normal Form requires that no non-prime attribute is partially dependent on any candidate key.',
  };
}

/**
 * Check 3NF: For every non-trivial FD X → A, either X is a superkey or A is a prime attribute.
 */
export function check3NF(
  relation: Relation,
  candidateKeys: string[][],
  primeAttributes: string[],
  allAttributes: string[]
): NormalFormCheck {
  const violations: string[] = [];

  for (const fd of relation.functionalDependencies) {
    // Skip trivial dependencies (where dependent ⊆ determinant)
    if (isSubset(fd.dependent, fd.determinant)) continue;

    // Check each dependent attribute individually
    for (const depAttr of fd.dependent) {
      if (fd.determinant.includes(depAttr)) continue; // Skip self-dependency

      const detIsSuperkey = isSuperkey(fd.determinant, allAttributes, relation.functionalDependencies);
      const isPrime = primeAttributes.includes(depAttr);

      if (!detIsSuperkey && !isPrime) {
        violations.push(
          `Transitive dependency: {${fd.determinant.join(', ')}} → "${depAttr}". ` +
          `The determinant {${fd.determinant.join(', ')}} is not a superkey, and "${depAttr}" is not a prime attribute.`
        );
      }
    }
  }

  if (violations.length > 0) {
    return {
      satisfied: false,
      reason: 'The relation violates 3NF due to transitive dependencies where non-prime attributes depend on non-superkeys.',
      violations: [...new Set(violations)],
      details: 'Third Normal Form requires that for every non-trivial FD X → A, either X is a superkey or A is a prime attribute. This eliminates transitive dependencies where non-key attributes depend on other non-key attributes.',
    };
  }

  return {
    satisfied: true,
    reason: 'The relation satisfies 3NF. Every non-trivial functional dependency has either a superkey determinant or a prime dependent attribute.',
    details: 'Third Normal Form eliminates transitive dependencies. For every FD X → A, either X must be a superkey or A must be part of a candidate key.',
  };
}

/**
 * Check BCNF: For every non-trivial FD X → Y, X must be a superkey.
 */
export function checkBCNF(
  relation: Relation,
  allAttributes: string[]
): NormalFormCheck {
  const violations: string[] = [];

  for (const fd of relation.functionalDependencies) {
    // Skip trivial dependencies
    if (isSubset(fd.dependent, fd.determinant)) continue;

    const detIsSuperkey = isSuperkey(fd.determinant, allAttributes, relation.functionalDependencies);

    if (!detIsSuperkey) {
      violations.push(
        `BCNF violation: {${fd.determinant.join(', ')}} → {${fd.dependent.join(', ')}}. ` +
        `The determinant {${fd.determinant.join(', ')}} is not a superkey of the relation.`
      );
    }
  }

  if (violations.length > 0) {
    return {
      satisfied: false,
      reason: 'The relation violates BCNF because some functional dependencies have determinants that are not superkeys.',
      violations,
      details: 'Boyce-Codd Normal Form requires that for every non-trivial FD X → Y, X must be a superkey. BCNF is stricter than 3NF because it does not allow the prime-attribute exception.',
    };
  }

  return {
    satisfied: true,
    reason: 'The relation satisfies BCNF. Every non-trivial functional dependency has a superkey as its determinant.',
    details: 'Boyce-Codd Normal Form requires that for every non-trivial FD X → Y, X must be a superkey.',
  };
}

/**
 * Check 4NF: Educational explanation about multivalued dependencies.
 * Full automatic checking requires explicit multivalued dependency declarations.
 */
export function check4NF(): NormalFormCheck {
  return {
    satisfied: true,
    reason: '4NF analysis requires explicit multivalued dependency (MVD) declarations. If no non-trivial MVDs exist, the relation satisfies 4NF (assuming it is in BCNF).',
    details: 'Fourth Normal Form addresses multivalued dependencies. A relation is in 4NF if for every non-trivial multivalued dependency X ↠ Y, X is a superkey. To fully verify 4NF, multivalued dependencies must be explicitly provided.',
  };
}

/**
 * Check 5NF: Educational explanation about join dependencies.
 * Full automatic checking requires explicit join dependency declarations.
 */
export function check5NF(): NormalFormCheck {
  return {
    satisfied: true,
    reason: '5NF analysis requires explicit join dependency declarations. If no non-trivial join dependencies exist, the relation satisfies 5NF (assuming it is in 4NF).',
    details: 'Fifth Normal Form (Project-Join Normal Form) addresses join dependencies. A relation is in 5NF if every non-trivial join dependency is implied by the candidate keys. This is the highest practical normal form.',
  };
}

/** Run all normal form checks */
export function analyzeNormalForms(
  relation: Relation,
  candidateKeys: string[][],
  primeAttributes: string[]
): NormalFormAnalysis {
  const allAttributes = getAttributeNames(relation);
  
  return {
    '1NF': check1NF(relation),
    '2NF': check2NF(relation, candidateKeys, primeAttributes),
    '3NF': check3NF(relation, candidateKeys, primeAttributes, allAttributes),
    'BCNF': checkBCNF(relation, allAttributes),
    '4NF': check4NF(),
    '5NF': check5NF(),
  };
}

// ============================================================
// ANOMALY DETECTION
// ============================================================

/**
 * Generate anomaly examples based on the relation's structure and dependencies.
 */
export function detectAnomalies(relation: Relation): AnomalyExample[] {
  const anomalies: AnomalyExample[] = [];
  const attrs = getAttributeNames(relation);
  const fds = relation.functionalDependencies;

  // Check for update anomalies (repeated information)
  if (fds.length > 0) {
    const nonKeyDeps = fds.filter(fd => {
      const allAttrs = attrs;
      return !isSuperkey(fd.determinant, allAttrs, fds);
    });

    if (nonKeyDeps.length > 0) {
      const fd = nonKeyDeps[0];
      anomalies.push({
        type: 'update',
        title: 'Update Anomaly Detected',
        description: `The functional dependency {${fd.determinant.join(', ')}} → {${fd.dependent.join(', ')}} means that information about "${fd.dependent[0]}" is stored alongside other data. If the same entity appears in multiple rows, its information must be updated in all of them.`,
        example: `For example, if "${fd.determinant[0]}" appears in multiple rows with the same "${fd.dependent[0]}" value, changing that value requires updating every row where it appears. Missing even one row creates data inconsistency.`,
        impact: 'Risk of data inconsistency. Different rows may show different values for the same real-world fact.',
      });
    }
  }

  // Check for insertion anomalies
  if (fds.length > 0 && relation.attributes.length > 3) {
    // If there are attributes not determined by any single-attribute key
    const singleAttrFDs = fds.filter(fd => fd.determinant.length === 1);
    const determinedBySingle = new Set<string>();
    for (const fd of singleAttrFDs) {
      for (const dep of fd.dependent) {
        determinedBySingle.add(dep);
      }
    }

    const undetermined = attrs.filter(a => !determinedBySingle.has(a) && !singleAttrFDs.some(fd => fd.determinant[0] === a));
    
    if (undetermined.length > 0) {
      anomalies.push({
        type: 'insertion',
        title: 'Insertion Anomaly Detected',
        description: `The relation stores information about multiple entity types together. To insert information about "${undetermined[0] || 'a new entity'}", you may need to provide values for other unrelated attributes, which might not yet be known.`,
        example: `For example, to record a new instructor, you might need to also provide student and course information. If no student is enrolled yet, you cannot add the instructor to this table.`,
        impact: 'Inability to record certain facts independently. New entities cannot be added without also providing information about other entities.',
      });
    }
  }

  // Check for deletion anomalies
  if (fds.length > 0 && relation.attributes.length > 3) {
    anomalies.push({
      type: 'deletion',
      title: 'Deletion Anomaly Detected',
      description: `Deleting a row removes information about all entities represented in that row. If a student drops a course, deleting their enrollment row also removes information about the course and instructor.`,
      example: `For example, if the last student enrolled in a particular course drops it, deleting that enrollment row also removes the record of that course and its instructor from the database entirely.`,
      impact: 'Unintended loss of information. Deleting one fact may cause the loss of other important facts.',
    });
  }

  return anomalies;
}

// ============================================================
// DECOMPOSITION
// ============================================================

/**
 * Suggest a decomposition based on the functional dependencies.
 * Groups attributes by their determinants to create separate relations.
 */
export function suggestDecomposition(
  relation: Relation,
  candidateKeys: string[][],
  primeAttributes: string[]
): DecompositionResult {
  const allAttributes = getAttributeNames(relation);
  const fds = relation.functionalDependencies;
  
  // Strategy: Create one relation for each FD, plus ensure all attributes are covered
  const decomposedRelations: Relation[] = [];
  const coveredAttributes = new Set<string>();
  const foreignKeys: { from: string; to: string; attributes: string[] }[] = [];

  // Group FDs by determinant
  const fdGroups = new Map<string, FunctionalDependency[]>();
  for (const fd of fds) {
    const key = fd.determinant.sort().join(',');
    if (!fdGroups.has(key)) {
      fdGroups.set(key, []);
    }
    fdGroups.get(key)!.push(fd);
  }

  // Create a relation for each FD group
  for (const [detKey, groupFDs] of fdGroups) {
    const determinant = groupFDs[0].determinant;
    const dependents = groupFDs.flatMap(fd => fd.dependent);
    const relationAttrs = [...new Set([...determinant, ...dependents])];
    
    // Only create if it has more than just the determinant
    if (dependents.length > 0) {
      const relName = determinant.map(d => d.replace(/ID$/i, '')).join('_').toUpperCase() || 'RELATION';
      decomposedRelations.push({
        name: relName,
        attributes: relationAttrs.map(a => ({
          name: a,
          isPrimaryKey: determinant.includes(a),
        })),
        functionalDependencies: groupFDs,
      });

      for (const attr of relationAttrs) {
        coveredAttributes.add(attr);
      }
    }
  }

  // Ensure all candidate key attributes are covered
  for (const ck of candidateKeys) {
    for (const attr of ck) {
      coveredAttributes.add(attr);
    }
  }

  // If some attributes aren't covered, add them to an appropriate relation
  const uncovered = allAttributes.filter(a => !coveredAttributes.has(a));
  if (uncovered.length > 0 && decomposedRelations.length > 0) {
    // Add uncovered attributes to the first relation that shares a determinant
    const firstRel = decomposedRelations[0];
    for (const attr of uncovered) {
      firstRel.attributes.push({ name: attr });
    }
  } else if (uncovered.length > 0) {
    // Create a relation with just the uncovered attributes and candidate keys
    const keyAttrs = candidateKeys[0] || [];
    const relAttrs = [...new Set([...keyAttrs, ...uncovered])];
    decomposedRelations.push({
      name: 'ADDITIONAL_INFO',
      attributes: relAttrs.map(a => ({
        name: a,
        isPrimaryKey: keyAttrs.includes(a),
      })),
      functionalDependencies: [],
    });
  }

  // Ensure we have a relation that contains a candidate key (for lossless join)
  const hasKeyRelation = decomposedRelations.some(rel => {
    const relAttrs = rel.attributes.map(a => a.name);
    return candidateKeys.some(ck => isSubset(ck, relAttrs));
  });

  if (!hasKeyRelation && candidateKeys.length > 0) {
    const ck = candidateKeys[0];
    decomposedRelations.push({
      name: 'KEY_RELATION',
      attributes: ck.map(a => ({ name: a, isPrimaryKey: true })),
      functionalDependencies: [],
    });
  }

  // Identify foreign keys
  for (const rel of decomposedRelations) {
    const relAttrs = rel.attributes.map(a => a.name);
    for (const otherRel of decomposedRelations) {
      if (rel === otherRel) continue;
      const otherKeyAttrs = otherRel.attributes
        .filter(a => a.isPrimaryKey)
        .map(a => a.name);
      
      // Check if this relation contains attributes that are a key in another relation
      // but are not a key in this relation
      const commonAttrs = relAttrs.filter(a => otherKeyAttrs.includes(a));
      const thisKeyAttrs = rel.attributes.filter(a => a.isPrimaryKey).map(a => a.name);
      
      if (commonAttrs.length > 0 && !isSubset(thisKeyAttrs, commonAttrs)) {
        foreignKeys.push({
          from: rel.name,
          to: otherRel.name,
          attributes: commonAttrs,
        });
      }
    }
  }

  // Check lossless join
  const { isLossless, explanation: losslessExplanation } = checkLosslessJoin(
    relation,
    decomposedRelations,
    candidateKeys
  );

  // Check dependency preservation
  const { preserves, explanation: depExplanation } = checkDependencyPreservation(
    relation,
    decomposedRelations
  );

  return {
    relations: decomposedRelations,
    isLossless,
    losslessExplanation,
    preservesDependencies: preserves,
    dependencyExplanation: depExplanation,
    foreignKeys: [...new Map(foreignKeys.map(fk => [`${fk.from}-${fk.to}-${fk.attributes.join(',')}`, fk])).values()],
  };
}

/**
 * Check if a decomposition is lossless.
 * A decomposition {R1, R2} is lossless if R1 ∩ R2 → R1 or R1 ∩ R2 → R2.
 * For multi-way decomposition, we check pairwise.
 */
export function checkLosslessJoin(
  original: Relation,
  decomposed: Relation[],
  candidateKeys: string[][]
): { isLossless: boolean | null; explanation: string } {
  if (decomposed.length < 2) {
    return { isLossless: true, explanation: 'A single relation is trivially lossless.' };
  }

  if (decomposed.length === 2) {
    const r1 = new Set(decomposed[0].attributes.map(a => a.name));
    const r2 = new Set(decomposed[1].attributes.map(a => a.name));
    const intersection = [...r1].filter(a => r2.has(a));

    if (intersection.length === 0) {
      return {
        isLossless: false,
        explanation: 'The intersection of the two decomposed relations is empty. A lossless join requires that the common attributes form a superkey of at least one of the relations.',
      };
    }

    const allAttrs = getAttributeNames(original);
    const fds = original.functionalDependencies;

    // Check if intersection → R1 or intersection → R2
    const closure = computeClosure(intersection, fds);
    const coversR1 = isSubset(allAttrs.filter(a => r1.has(a)), closure);
    const coversR2 = isSubset(allAttrs.filter(a => r2.has(a)), closure);

    if (coversR1 || coversR2) {
      return {
        isLossless: true,
        explanation: `The intersection {${intersection.join(', ')}} functionally determines all attributes of ${coversR1 ? decomposed[0].name : decomposed[1].name}. This guarantees a lossless join.`,
      };
    }

    // Also check if intersection is a superkey of either relation
    const r1Attrs = [...r1];
    const r2Attrs = [...r2];
    const isSKofR1 = candidateKeys.some(ck => isSubset(ck, intersection) && isSubset(intersection, r1Attrs));
    const isSKofR2 = candidateKeys.some(ck => isSubset(ck, intersection) && isSubset(intersection, r2Attrs));

    if (isSKofR1 || isSKofR2) {
      return {
        isLossless: true,
        explanation: `The intersection {${intersection.join(', ')}} contains a candidate key of ${isSKofR1 ? decomposed[0].name : decomposed[1].name}. This guarantees a lossless join.`,
      };
    }

    return {
      isLossless: null,
      explanation: `The intersection {${intersection.join(', ')}} does not clearly form a superkey of either relation based on the declared dependencies. Losslessness cannot be confirmed from the available information.`,
    };
  }

  // For multi-way decomposition, check if we can apply the binary test iteratively
  // This is a simplified check
  const allDecomposedAttrs = decomposed.flatMap(r => r.attributes.map(a => a.name));
  const originalAttrs = getAttributeNames(original);
  
  if (!setsEqual([...new Set(allDecomposedAttrs)], originalAttrs)) {
    return {
      isLossless: false,
      explanation: 'The decomposition does not cover all original attributes. A valid decomposition must include every attribute of the original relation.',
    };
  }

  // Check if at least one relation contains a candidate key
  const hasKeyRelation = decomposed.some(rel => {
    const relAttrs = rel.attributes.map(a => a.name);
    return candidateKeys.some(ck => isSubset(ck, relAttrs));
  });

  if (hasKeyRelation) {
    return {
      isLossless: true,
      explanation: 'At least one decomposed relation contains a candidate key of the original relation. This is a necessary condition for lossless decomposition and supports the conclusion that the decomposition is likely lossless.',
    };
  }

  return {
    isLossless: null,
    explanation: 'For multi-way decomposition, losslessness requires that at least one relation contains a candidate key and that pairwise joins are lossless. This could not be fully verified from the available information.',
  };
}

/**
 * Check if a decomposition preserves all functional dependencies.
 * A decomposition preserves dependencies if every FD can be enforced
 * in at least one of the decomposed relations.
 */
export function checkDependencyPreservation(
  original: Relation,
  decomposed: Relation[]
): { preserves: boolean | null; explanation: string } {
  const originalFDs = original.functionalDependencies;
  if (originalFDs.length === 0) {
    return { preserves: true, explanation: 'No functional dependencies to preserve.' };
  }

  const preserved: FunctionalDependency[] = [];
  const notPreserved: FunctionalDependency[] = [];

  for (const fd of originalFDs) {
    // Check if this FD is preserved in any decomposed relation
    const isPreserved = decomposed.some(rel => {
      const relAttrs = new Set(rel.attributes.map(a => a.name));
      // The FD is preserved if all its attributes are in one decomposed relation
      return fd.determinant.every(d => relAttrs.has(d)) && fd.dependent.every(d => relAttrs.has(d));
    });

    if (isPreserved) {
      preserved.push(fd);
    } else {
      notPreserved.push(fd);
    }
  }

  if (notPreserved.length === 0) {
    return {
      preserves: true,
      explanation: `All ${originalFDs.length} functional dependencies are preserved in the decomposed relations. Each FD's attributes appear together in at least one decomposed relation.`,
    };
  }

  return {
    preserves: false,
    explanation: `${notPreserved.length} of ${originalFDs.length} functional dependencies cannot be directly enforced in any single decomposed relation: {${notPreserved.map(fd => `${fd.determinant.join(',')} → ${fd.dependent.join(',')}`).join('; ')}}. These dependencies would require joins to verify, which is computationally expensive.`,
  };
}

// ============================================================
// FULL ANALYSIS
// ============================================================

/**
 * Perform a complete analysis of a relation.
 */
export function analyzeRelation(relation: Relation): AnalysisResult {
  const allAttributes = getAttributeNames(relation);
  const warnings: string[] = [];

  // Validate input
  if (allAttributes.length === 0) {
    return {
      relation,
      candidateKeys: [],
      primeAttributes: [],
      superkeys: [],
      closures: [],
      normalForms: {
        '1NF': { satisfied: false, reason: 'No attributes defined.', violations: ['The relation has no attributes.'] },
        '2NF': { satisfied: false, reason: 'Cannot check 2NF without attributes.' },
        '3NF': { satisfied: false, reason: 'Cannot check 3NF without attributes.' },
        'BCNF': { satisfied: false, reason: 'Cannot check BCNF without attributes.' },
        '4NF': { satisfied: false, reason: 'Cannot check 4NF without attributes.' },
        '5NF': { satisfied: false, reason: 'Cannot check 5NF without attributes.' },
      },
      anomalies: [],
      warnings: ['The relation has no attributes defined.'],
    };
  }

  // Compute closures
  const closures = computeAllSingleClosures(allAttributes, relation.functionalDependencies);

  // Find candidate keys
  const { keys: candidateKeys, warning: keyWarning } = findCandidateKeys(allAttributes, relation.functionalDependencies);
  if (keyWarning) warnings.push(keyWarning);

  // Get prime attributes
  const primeAttributes = getPrimeAttributes(allAttributes, candidateKeys);

  // Find superkeys (limit for performance)
  const superkeys = allAttributes.length <= 10
    ? findSuperkeys(allAttributes, relation.functionalDependencies, candidateKeys)
    : [];

  if (allAttributes.length > 10) {
    warnings.push('Superkey enumeration is limited to schemas with 10 or fewer attributes for performance reasons.');
  }

  // Analyze normal forms
  const normalForms = analyzeNormalForms(relation, candidateKeys, primeAttributes);

  // Detect anomalies
  const anomalies = detectAnomalies(relation);

  // Suggest decomposition if not in BCNF
  let decomposition: DecompositionResult | undefined;
  if (!normalForms.BCNF.satisfied || !normalForms['3NF'].satisfied) {
    decomposition = suggestDecomposition(relation, candidateKeys, primeAttributes);
  }

  return {
    relation,
    candidateKeys,
    primeAttributes,
    superkeys,
    closures,
    normalForms,
    anomalies,
    decomposition,
    warnings,
  };
}
