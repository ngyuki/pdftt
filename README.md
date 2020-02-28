# pdftt

## Usage

```
Usage: pdftt.js <input> <output> <json>

Examples:
    pdftt.js template.pdf output.pdf '[
        {"page":0, "x":100, "y":200, "size":20, "text":"this is test1"},
        {"page":0, "x":100, "y":300, "size":20, "text":"this is test2"},
        {"page":0, "x":100, "y":400, "size":20, "text":"this is test3"}
    ]'

Specify your own font:
    You can specify font path with the environment variable PDFGEN_FONT.

      export PDFGEN_FONT=/usr/share/fonts/ipa-gothic/ipag.ttf
```

## Use docker

```sh
docker build . -t ngyuki/pdftt
docker run --rm -i ngyuki/pdftt \
  pdftt - - '[{"page":0, "x":100, "y":200, "size":20, "text":"あいうえお"}]' \
  < template.pdf > output.pdf
```

## Refs

- https://github.com/Hopding/pdf-lib/
