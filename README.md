# pdftt

## Example

```sh
node bin/pdftt.js '[{"page":0, "x":100, "y":200, "size":20, "text":"this is test"}]' \
  < template.pdf > output.pdf
```

## Docker build

```sh
docker build . -t ngyuki/pdftt
docker run --rm -i ngyuki/pdftt \
  pdftt '[{"page":0, "x":100, "y":200, "size":20, "text":"あいうえお"}]' \
  < template.pdf > output.pdf
```

## Refs

- https://github.com/Hopding/pdf-lib/
