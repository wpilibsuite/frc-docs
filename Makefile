# Minimal makefile for Sphinx documentation
#
# You can set these variables from the command line.

SPHINXOPTS    = -W --keep-going -q
SPHINXBUILD   = sphinx-build
SOURCEDIR     = source
BUILDDIR      = build
LINTER        = doc8
LINTEROPTS    = --ignore D001 # D001 is linelength
SIZECHECKER   = python3 -m scripts.imagesizechecker
CONFEXCLUDE   = --exclude-file source/conf.py
SIZEMAX       = 500

ifeq ($(CI), true)
	SPHINXOPTS += --color
endif

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

lint:
	@$(LINTER) $(LINTEROPTS) $(SOURCEDIR)

sizecheck:
	@$(SIZECHECKER) $(SOURCEDIR) $(SIZEMAX) $(CONFEXCLUDE)

.PHONY: help lint Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
