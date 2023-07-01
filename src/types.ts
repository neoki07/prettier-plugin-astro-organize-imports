import type { Plugin, Options } from 'prettier';

export interface NamedPlugin extends Plugin {
	name: string;
}

export interface OptionsWithNamedPlugins extends Options {
	plugins?: NamedPlugin[];
}
