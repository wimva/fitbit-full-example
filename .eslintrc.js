module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-no-undef': 0,
    'react/destructuring-assignment': 0,
    'max-len': 0,
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
      'haptics',
      'power',
      'device',
      'peer',
    ],
  },
};
