const basicOptions = [
    'incremental',
    'allowJs',
    'checkJs',
    'declaration',
    'declarationMap',
    'sourceMap',
    'composite',
    'removeComments',
    'noEmit',
    'importHelpers',
    'downlevelIteration',
    'isolatedModules',
]

const strictTypeCheckingOptions = [
    'strict',
    'noImplicitAny',
    'strictNullChecks',
    'strictFunctionTypes',
    'strictBindCallApply',
    'strictPropertyInitialization',
    'noImplicitThis',
    'alwaysStrict',
]

const additionalChecksOptions = [
    'noUnusedLocals',
    'noUnusedParameters',
    'noImplicitReturns',
    'noFallthroughCasesInSwitch',
]

const moduleResolutionOptions = [
    'allowSyntheticDefaultImports',
    'esModuleInterop',
    'preserveSymlinks',
    'allowUmdGlobalAccess',
]

const sourceMapOptions = [
    'inlineSourceMap',
    'inlineSources',
]

const experimentalOptions = [
    'experimentalDecorators',
    'emitDecoratorMetadata',
]

const advancedOptions = [
    'forceConsistentCasingInFileNames',
]

const tsConfigChoices = [
    {
        optionLabel: '== Basic Options ==',
        optionNames: basicOptions
    },
    {
        optionLabel: '== Strict Type-Checking Options ==',
        optionNames: strictTypeCheckingOptions
    },
    {
        optionLabel: '== Additional Checks ==',
        optionNames: additionalChecksOptions
    },
    {
        optionLabel: '== Module Resolution Options ==',
        optionNames: moduleResolutionOptions
    },
    {
        optionLabel: '== Source Map Options ==',
        optionNames: sourceMapOptions
    },
    {
        optionLabel: '== Experimental Options ==',
        optionNames: experimentalOptions
    },
    {
        optionLabel: '== Advanced Options ==',
        optionNames: advancedOptions
    },
]

module.exports = {
    basicOptions,
    strictTypeCheckingOptions,
    additionalChecksOptions,
    moduleResolutionOptions,
    sourceMapOptions,
    experimentalOptions,
    advancedOptions,
    tsConfigChoices,
}
