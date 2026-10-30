import type { SampleDatabase, QuizQuestion } from '../types';

export const sampleDatabases: SampleDatabase[] = [
  {
    id: 'university-enrollment',
    name: 'University Enrollment',
    description: 'A relation that stores student, course, and instructor information together in a single table.',
    purpose: 'Demonstrates repeated facts, functional dependencies, update/insertion/deletion anomalies, and normalization from 1NF to BCNF.',
    relation: {
      name: 'ENROLLMENT',
      attributes: [
        { name: 'StudentID', dataType: 'VARCHAR', isPrimaryKey: true },
        { name: 'StudentName', dataType: 'VARCHAR' },
        { name: 'CourseID', dataType: 'VARCHAR', isPrimaryKey: true },
        { name: 'CourseName', dataType: 'VARCHAR' },
        { name: 'InstructorID', dataType: 'VARCHAR' },
        { name: 'InstructorName', dataType: 'VARCHAR' },
      ],
      functionalDependencies: [
        { id: 'fd1', determinant: ['StudentID'], dependent: ['StudentName'] },
        { id: 'fd2', determinant: ['CourseID'], dependent: ['CourseName', 'InstructorID'] },
        { id: 'fd3', determinant: ['InstructorID'], dependent: ['InstructorName'] },
      ],
      sampleData: [
        { StudentID: 'S001', StudentName: 'Alice Johnson', CourseID: 'C01', CourseName: 'Database Systems', InstructorID: 'I01', InstructorName: 'Dr. Smith' },
        { StudentID: 'S001', StudentName: 'Alice Johnson', CourseID: 'C02', CourseName: 'Data Structures', InstructorID: 'I02', InstructorName: 'Prof. Davis' },
        { StudentID: 'S002', StudentName: 'Bob Williams', CourseID: 'C01', CourseName: 'Database Systems', InstructorID: 'I01', InstructorName: 'Dr. Smith' },
        { StudentID: 'S003', StudentName: 'Carol Brown', CourseID: 'C02', CourseName: 'Data Structures', InstructorID: 'I02', InstructorName: 'Prof. Davis' },
        { StudentID: 'S003', StudentName: 'Carol Brown', CourseID: 'C03', CourseName: 'Algorithms', InstructorID: 'I03', InstructorName: 'Dr. Wilson' },
      ],
    },
  },
  {
    id: 'company-employees',
    name: 'Company Employees',
    description: 'A relation that stores employee and department information together.',
    purpose: 'Demonstrates transitive dependencies and 3NF violations. EmployeeID determines DepartmentID, which in turn determines DepartmentName and DepartmentHead.',
    relation: {
      name: 'EMPLOYEE_DEPT',
      attributes: [
        { name: 'EmployeeID', dataType: 'VARCHAR', isPrimaryKey: true },
        { name: 'EmployeeName', dataType: 'VARCHAR' },
        { name: 'DepartmentID', dataType: 'VARCHAR' },
        { name: 'DepartmentName', dataType: 'VARCHAR' },
        { name: 'DepartmentHead', dataType: 'VARCHAR' },
      ],
      functionalDependencies: [
        { id: 'fd1', determinant: ['EmployeeID'], dependent: ['EmployeeName', 'DepartmentID'] },
        { id: 'fd2', determinant: ['DepartmentID'], dependent: ['DepartmentName', 'DepartmentHead'] },
      ],
      sampleData: [
        { EmployeeID: 'E001', EmployeeName: 'John Carter', DepartmentID: 'D01', DepartmentName: 'Engineering', DepartmentHead: 'Dr. Adams' },
        { EmployeeID: 'E002', EmployeeName: 'Jane Miller', DepartmentID: 'D01', DepartmentName: 'Engineering', DepartmentHead: 'Dr. Adams' },
        { EmployeeID: 'E003', EmployeeName: 'Mike Davis', DepartmentID: 'D02', DepartmentName: 'Marketing', DepartmentHead: 'Prof. Lee' },
        { EmployeeID: 'E004', EmployeeName: 'Sarah Wilson', DepartmentID: 'D02', DepartmentName: 'Marketing', DepartmentHead: 'Prof. Lee' },
        { EmployeeID: 'E005', EmployeeName: 'Tom Harris', DepartmentID: 'D03', DepartmentName: 'Finance', DepartmentHead: 'Dr. Brown' },
      ],
    },
  },
  {
    id: 'online-orders',
    name: 'Online Orders',
    description: 'A relation that stores order, customer, and product information together.',
    purpose: 'Demonstrates composite keys, repeated customer and product information, and normalization of a multi-entity relation.',
    relation: {
      name: 'ORDER_DETAILS',
      attributes: [
        { name: 'OrderID', dataType: 'VARCHAR', isPrimaryKey: true },
        { name: 'OrderDate', dataType: 'DATE' },
        { name: 'CustomerID', dataType: 'VARCHAR' },
        { name: 'CustomerName', dataType: 'VARCHAR' },
        { name: 'ProductID', dataType: 'VARCHAR', isPrimaryKey: true },
        { name: 'ProductName', dataType: 'VARCHAR' },
        { name: 'Quantity', dataType: 'INT' },
      ],
      functionalDependencies: [
        { id: 'fd1', determinant: ['OrderID'], dependent: ['OrderDate', 'CustomerID'] },
        { id: 'fd2', determinant: ['CustomerID'], dependent: ['CustomerName'] },
        { id: 'fd3', determinant: ['ProductID'], dependent: ['ProductName'] },
      ],
      sampleData: [
        { OrderID: 'ORD001', OrderDate: '2024-01-15', CustomerID: 'CU01', CustomerName: 'Emma Stone', ProductID: 'P01', ProductName: 'Laptop', Quantity: 1 },
        { OrderID: 'ORD001', OrderDate: '2024-01-15', CustomerID: 'CU01', CustomerName: 'Emma Stone', ProductID: 'P02', ProductName: 'Mouse', Quantity: 2 },
        { OrderID: 'ORD002', OrderDate: '2024-01-16', CustomerID: 'CU02', CustomerName: 'Ryan Park', ProductID: 'P01', ProductName: 'Laptop', Quantity: 1 },
        { OrderID: 'ORD003', OrderDate: '2024-01-17', CustomerID: 'CU01', CustomerName: 'Emma Stone', ProductID: 'P03', ProductName: 'Keyboard', Quantity: 1 },
        { OrderID: 'ORD004', OrderDate: '2024-01-18', CustomerID: 'CU03', CustomerName: 'Lisa Chen', ProductID: 'P02', ProductName: 'Mouse', Quantity: 3 },
      ],
    },
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is a functional dependency?',
    options: [
      'A relationship between two tables using foreign keys',
      'A constraint where one set of attributes uniquely determines another set',
      'A mathematical function stored in the database',
      'A dependency between two databases',
    ],
    correctAnswer: 1,
    explanation: 'A functional dependency X → Y means that for any two tuples with the same X values, they must also have the same Y values. In other words, X uniquely determines Y.',
    topic: 'Functional Dependencies',
  },
  {
    id: 'q2',
    question: 'What is a candidate key?',
    options: [
      'Any attribute that can be used as a primary key',
      'A minimal superkey — a minimal set of attributes that uniquely identifies every tuple',
      'The first attribute in a relation',
      'Any combination of attributes',
    ],
    correctAnswer: 1,
    explanation: 'A candidate key is a minimal superkey. It is a set of attributes whose closure is all attributes of the relation, and no proper subset has this property.',
    topic: 'Candidate Keys',
  },
  {
    id: 'q3',
    question: 'Which normal form eliminates partial dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: 1,
    explanation: 'Second Normal Form (2NF) eliminates partial dependencies. A partial dependency occurs when a non-prime attribute depends on only part of a composite candidate key.',
    topic: 'Normal Forms',
  },
  {
    id: 'q4',
    question: 'What is a transitive dependency?',
    options: [
      'When A → B and B → C, creating A → C indirectly',
      'When two attributes depend on each other',
      'When an attribute depends on part of a key',
      'When all attributes depend on the primary key',
    ],
    correctAnswer: 0,
    explanation: 'A transitive dependency occurs when A → B and B → C (where B does not determine A). This means A → C indirectly through B. 3NF eliminates transitive dependencies of non-prime attributes.',
    topic: 'Normal Forms',
  },
  {
    id: 'q5',
    question: 'What is an insertion anomaly?',
    options: [
      'When you cannot insert a new tuple because the table is full',
      'When you cannot record certain facts because required related data does not exist yet',
      'When inserting causes the database to crash',
      'When duplicate data is inserted',
    ],
    correctAnswer: 1,
    explanation: 'An insertion anomaly occurs when the table design prevents you from recording certain information independently. For example, you cannot add a new instructor to a table that also requires student enrollment data.',
    topic: 'Anomalies',
  },
  {
    id: 'q6',
    question: 'What does BCNF require that 3NF does not?',
    options: [
      'BCNF requires all attributes to be atomic',
      'BCNF requires every determinant to be a superkey (no prime-attribute exception)',
      'BCNF requires composite keys',
      'BCNF requires multivalued dependencies to be eliminated',
    ],
    correctAnswer: 1,
    explanation: 'BCNF is stricter than 3NF. In 3NF, a dependency X → A is allowed if A is a prime attribute, even if X is not a superkey. BCNF removes this exception — every determinant must be a superkey.',
    topic: 'Normal Forms',
  },
  {
    id: 'q7',
    question: 'What is a lossless decomposition?',
    options: [
      'A decomposition that removes all data',
      'A decomposition where joining the resulting relations produces exactly the original relation',
      'A decomposition that removes all anomalies',
      'A decomposition into exactly two relations',
    ],
    correctAnswer: 1,
    explanation: 'A lossless (or lossless-join) decomposition guarantees that the natural join of the decomposed relations produces exactly the original relation — no extra tuples and no missing tuples.',
    topic: 'Decomposition',
  },
  {
    id: 'q8',
    question: 'What is Armstrong\'s Axiom of Transitivity?',
    options: [
      'If X → Y, then XZ → YZ',
      'If X → Y and Y → Z, then X → Z',
      'If Y ⊆ X, then X → Y',
      'If X → Y, then Y → X',
    ],
    correctAnswer: 1,
    explanation: 'Transitivity states that if X functionally determines Y, and Y functionally determines Z, then X functionally determines Z. This is how we derive indirect dependencies.',
    topic: 'Armstrong\'s Axioms',
  },
  {
    id: 'q9',
    question: 'Which of the following is true about dependency preservation?',
    options: [
      'Every decomposition preserves all dependencies',
      'A decomposition preserves dependencies if each original FD can be checked in at least one decomposed relation',
      'Dependency preservation is more important than lossless join',
      'BCNF decomposition always preserves dependencies',
    ],
    correctAnswer: 1,
    explanation: 'A decomposition preserves dependencies if every functional dependency from the original relation can be enforced by checking it within at least one of the decomposed relations (without needing joins).',
    topic: 'Decomposition',
  },
  {
    id: 'q10',
    question: 'What is a superkey?',
    options: [
      'A key that is larger than the primary key',
      'Any set of attributes whose closure includes all attributes of the relation',
      'A key that references another table',
      'A unique index on the table',
    ],
    correctAnswer: 1,
    explanation: 'A superkey is any set of attributes that functionally determines all attributes of the relation. A candidate key is a minimal superkey (no proper subset is also a superkey).',
    topic: 'Candidate Keys',
  },
];

export const learningTopics = [
  {
    id: 'fd',
    title: 'Functional Dependencies',
    icon: '🔗',
    content: `A **functional dependency** (FD) X → Y means that the values of attribute set X uniquely determine the values of attribute set Y.

**Formal Definition:** For any two tuples t1 and t2 in a relation, if t1[X] = t2[X], then t1[Y] = t2[Y].

**Example:** StudentID → StudentName means that knowing a student's ID is enough to determine their name.

**Key Points:**
- The left side (X) is called the **determinant**.
- The right side (Y) is called the **dependent**.
- FDs are constraints on all legal instances of a relation.
- FDs are derived from the semantics of the data, not from sample data alone.`,
  },
  {
    id: 'closure',
    title: 'Attribute Closure',
    icon: '🔄',
    content: `The **closure** of a set of attributes X, written X⁺, is the set of all attributes functionally determined by X.

**Algorithm:**
1. Start with X⁺ = X
2. For each FD A → B, if A ⊆ X⁺, add B to X⁺
3. Repeat step 2 until X⁺ does not change

**Example:** Given StudentID → StudentName and StudentID → CourseID:
- {StudentID}⁺ = {StudentID, StudentName, CourseID}

**Uses:**
- Determine if X is a superkey (X⁺ = all attributes)
- Check if an FD is implied by a set of FDs
- Find candidate keys`,
  },
  {
    id: 'keys',
    title: 'Candidate Keys & Superkeys',
    icon: '🔑',
    content: `**Superkey:** A set of attributes whose closure includes all attributes of the relation.

**Candidate Key:** A *minimal* superkey — no proper subset is also a superkey.

**Prime Attribute:** An attribute that appears in at least one candidate key.

**Non-Prime Attribute:** An attribute that does not appear in any candidate key.

**Example:** In ENROLLMENT(StudentID, StudentName, CourseID, CourseName, InstructorID, InstructorName):
- If StudentID → StudentName and CourseID → CourseName, InstructorID
- And {StudentID, CourseID}⁺ = all attributes
- Then {StudentID, CourseID} is a candidate key
- StudentID and CourseID are prime attributes
- StudentName, CourseName, InstructorID, InstructorName are non-prime`,
  },
  {
    id: 'armstrong',
    title: "Armstrong's Axioms",
    icon: '📐',
    content: `Armstrong's axioms are a complete set of inference rules for functional dependencies:

**1. Reflexivity:** If Y ⊆ X, then X → Y
- Trivial dependencies are always true.

**2. Augmentation:** If X → Y, then XZ → YZ for any Z
- Adding the same attributes to both sides preserves the dependency.

**3. Transitivity:** If X → Y and Y → Z, then X → Z
- Dependencies can be chained.

**Additional Rules (derived):**
- **Union:** If X → Y and X → Z, then X → YZ
- **Decomposition:** If X → YZ, then X → Y and X → Z
- **Pseudotransitivity:** If X → Y and YZ → W, then XZ → W`,
  },
  {
    id: 'anomalies',
    title: 'Database Anomalies',
    icon: '⚠️',
    content: `Poor database design can lead to three types of anomalies:

**1. Update Anomaly:**
The same information is stored in multiple rows. Changing it requires updating all copies. Missing one creates inconsistency.

**2. Insertion Anomaly:**
You cannot add certain information without also adding unrelated information. For example, you cannot record a new course without also enrolling a student.

**3. Deletion Anomaly:**
Deleting one piece of information accidentally removes other important information. For example, removing the last student from a course also deletes the course record.

**Solution:** Normalization decomposes the relation to eliminate these anomalies.`,
  },
  {
    id: '1nf',
    title: 'First Normal Form (1NF)',
    icon: '1️⃣',
    content: `**Definition:** A relation is in 1NF if every attribute contains only atomic (indivisible) values.

**Requirements:**
- Each cell contains exactly one value
- No repeating groups or arrays
- Each column has a unique name
- The order of rows and columns does not matter

**Violation Example:**
| StudentID | Courses |
|-----------|---------|
| S001 | Math, Physics, CS |

This violates 1NF because "Courses" contains multiple values.

**Fix:** Create separate rows or a separate table for courses.`,
  },
  {
    id: '2nf',
    title: 'Second Normal Form (2NF)',
    icon: '2️⃣',
    content: `**Definition:** A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key.

**Partial Dependency:** A non-prime attribute depends on only part of a composite candidate key.

**When is 2NF relevant?** Only when the relation has a composite (multi-attribute) candidate key.

**Violation Example:**
ENROLLMENT(StudentID, CourseID, StudentName, CourseName)
- Candidate key: {StudentID, CourseID}
- StudentID → StudentName (partial dependency!)
- CourseID → CourseName (partial dependency!)

**Fix:** Decompose into:
- STUDENT(StudentID, StudentName)
- COURSE(CourseID, CourseName)
- ENROLLMENT(StudentID, CourseID)`,
  },
  {
    id: '3nf',
    title: 'Third Normal Form (3NF)',
    icon: '3️⃣',
    content: `**Definition:** A relation is in 3NF if it is in 2NF and for every non-trivial FD X → A:
- X is a superkey, OR
- A is a prime attribute

**Transitive Dependency:** When A → B and B → C (B does not determine A), we have A → C transitively through B.

**Violation Example:**
EMPLOYEE(EmployeeID, EmployeeName, DepartmentID, DepartmentName)
- EmployeeID → DepartmentID → DepartmentName
- DepartmentName transitively depends on EmployeeID through DepartmentID
- DepartmentID is not a superkey, DepartmentName is not prime

**Fix:** Decompose into:
- EMP(EmployeeID, EmployeeName, DepartmentID)
- DEPT(DepartmentID, DepartmentName)`,
  },
  {
    id: 'bcnf',
    title: 'Boyce-Codd Normal Form (BCNF)',
    icon: '🔷',
    content: `**Definition:** A relation is in BCNF if for every non-trivial FD X → Y, X is a superkey.

**Difference from 3NF:** BCNF does not allow the "prime attribute" exception. Every determinant must be a superkey.

**When does BCNF differ from 3NF?** When there is an FD X → A where A is prime but X is not a superkey.

**Violation Example:**
STUDENT_COURSE(StudentID, CourseID, InstructorID)
- {StudentID, CourseID} → InstructorID
- InstructorID → CourseID (an instructor teaches only one course)
- InstructorID is not a superkey → BCNF violation

**Note:** BCNF decomposition may not always preserve all dependencies. This is a known trade-off.`,
  },
  {
    id: 'decomposition',
    title: 'Lossless Decomposition & Dependency Preservation',
    icon: '🧩',
    content: `**Lossless Join Decomposition:**
A decomposition {R1, R2} is lossless if the natural join R1 ⋈ R2 produces exactly the original relation R.

**Test for binary decomposition:** R1 ∩ R2 must be a superkey of R1 or R2.

**Dependency Preservation:**
A decomposition preserves dependencies if every FD from the original relation can be enforced within at least one decomposed relation.

**Test:** For each FD X → Y, check if all attributes of X and Y appear together in some Ri.

**Trade-offs:**
- 3NF decomposition: Always lossless AND dependency-preserving
- BCNF decomposition: Always lossless, but may NOT preserve all dependencies
- In practice, we sometimes accept a 3NF design that is not in BCNF to preserve important dependencies.`,
  },
];
