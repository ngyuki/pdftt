# pdftt

## Example

```sh
node bin/pdftt.js template.pdf output.pdf \
  '[{"page":0, "x":100, "y":200, "size":20, "text":"this is test"}]'
```

## Docker build

```sh
docker build . -t ngyuki/pdftt
docker run --rm -i ngyuki/pdftt \
  pdftt - - '[{"page":0, "x":100, "y":200, "size":20, "text":"あいうえお"}]' \
  < template.pdf > output.pdf
```

## Refs

- https://github.com/Hopding/pdf-lib/
