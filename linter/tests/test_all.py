import doc8
import pytest


@pytest.mark.path("test-example.rst")
def test_example(result: doc8.main.Result):
    assert len(result.errors) == 0
