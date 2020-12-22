# FRC DOCS LINTER

## Usage
### Manual
1. Install this package's requirements
```python
python -m pip install -r requirements.txt
```
2. Install this package
```python
python -m pip install .
```
3. Run frc-docs's make lint rule
```bash
make lint
```

### VS Code
1. Follow instructions 1 and 2 from above
2. Install the `reStructuredText` VS Code extension
3. Add
```json
    "restructuredtext.linter.name": "doc8",
    "restructuredtext.linter.extraArgs": [
        "--ignore D001",
        "--ignore D004",
        "--ignore D002",
        "--ignore WUMBO002"
    ],
```
to your `settings.json` file.

## Contribution Guidelines
### Checks
- Checks can never yield a line number < 1
- Checks must compile regex patterns once per import, not once per file