module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-undef': 'off',
    'react/destructuring-assignment': 'off',
  },
  globals: {
    registerSettingsPage: false,
  },
  settings: {
    'import/core-modules': [
      'clock',
      'document',
      'geolocation',
      'messaging',
      'settings',
      'display',
      'appbit',
      'cbor',
      'user-profile',
      'user-settings',
      'user-activity',
      'local-storage',
      'heart-rate',
      'file-transfer',
      'app-cluster-storage',
      'haptics',
      'power',
      'device',
      'peer',
    ],
  },
};
