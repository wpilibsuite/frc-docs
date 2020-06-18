# Minimal makefile for Sphinx documentation
#
# You can set these variables from the command line.

SPHINXOPTS    = -W --keep-going
SPHINXBUILD   = sphinx-build
SOURCEDIR     = source
BUILDDIR      = build
LINTER        = doc8
LINTEROPTS    = --ignore D001 # D001 is linelength
LANGMAP       = es_MX: es, fr_CA: fr, he_IL: he, tr_TR: tr
SIZECHECKER   = python3 -m scripts.imagesizechecker
IMGUSAGECHCKR = python3 -m scripts.imageusagechecker
CONFEXCLUDE   = --exclude-file source/conf.py
SIZEMAX       = 500


# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

lint:
	@$(LINTER) $(LINTEROPTS) $(SOURCEDIR)

sizecheck:
	@$(SIZECHECKER) $(SOURCEDIR) $(SIZEMAX) $(CONFEXCLUDE)

imgusagecheck:
	@$(SPHINXBUILD) -M html "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	@$(IMGUSAGECHCKR) $(SOURCEDIR) $(BUILDDIR) $(CONFEXCLUDE)

translate:
	@$(SPHINXBUILD) -M gettext "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	rm -f .tx/config
	sphinx-intl create-txconfig
	echo "lang_map = $(LANGMAP)" >> .tx/config
	sphinx-intl update-txconfig-resources --transifex-project-name frc-docs

.PHONY: help lint translate Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
