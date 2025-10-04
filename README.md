Top-Level Shape
Field	Type	Description
data	array	An array of article result objects.
Article Object Fields
Field	Type	Description
_id	string	MongoDB document identifier.
pmid	string	PubMed ID (unique identifier from PubMed, if indexed).
doi	string	Digital Object Identifier (persistent identifier linking to the article).
title	string	Full title of the article.
abstract	string	Publisher-provided summary of the article.
journal	string	Name of the journal where the article was published.
year	string	Year of publication.
authors	string[]	List of credited authors.
tl_dr	string	Short 1–2 sentence summary of the article.
tags	string[]	High-level thematic keywords.
key_terms	string[]	Important terms and concepts extracted from the article.
quotes	string[]	Key direct excerpts from the article text.
score	number	Vector similarity score from MongoDB Atlas $vectorSearch.
rank	number	Final rank assigned after reranking (1 = most relevant).
reason	string	Short explanation of why this article was chosen and how it relates to the search basis.
