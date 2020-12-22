import pytest
import doc8


def pytest_configure(config):
    config.addinivalue_line("markers", "path: set file(s) to use in test")


@pytest.fixture
def result(request):
    marker = request.node.get_closest_marker("path").args[0]
    if isinstance(marker, str):
        marker = [marker]
    return doc8.doc8(paths=marker, ignore=["D001"])
