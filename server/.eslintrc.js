module.exports = {
  env: {
    commonjs: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'new-cap': ['error', { properties: false }],
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['ret'] }],
  },
};
