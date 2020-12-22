# FRC DOCS LINTER

## Usage
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

## Contribution Guidelines
### Checks
- Checks can never yield a line number < 1
- Checks must compile regex patterns once per import, not once per file