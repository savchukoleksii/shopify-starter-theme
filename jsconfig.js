module.exports = {
  "include": ["src/*"],
  "compilerOptions": {
    "target": "es6",
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/scripts/*"]
    }
  }
};
