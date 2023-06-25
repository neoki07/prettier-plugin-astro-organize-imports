import { test } from '../test-utils';

const files = import.meta.glob('/test/fixtures/*/*', {
	eager: true,
	as: 'raw',
});

test('Can format a basic import file', files, 'basic');

test('Can format an unused import file', files, 'unused');

test('Skip format `// organize-imports-ignore` file', files, 'organize-imports-ignore');

test(
	'Skip format `// tslint:disable:ordered-imports` file',
	files,
	'tslint-disable-ordered-imports'
);
