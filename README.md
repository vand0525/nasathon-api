| Field       | Type       | Description                                                                 |
|-------------|------------|-----------------------------------------------------------------------------|
| `_id`       | string     | MongoDB document identifier.                                                |
| `pmid`      | string     | PubMed ID (unique identifier from PubMed, if indexed).                      |
| `doi`       | string     | Digital Object Identifier (persistent link to the published article).       |
| `title`     | string     | Full title of the article.                                                  |
| `abstract`  | string     | Publisher-provided summary of the article.                                  |
| `journal`   | string     | Journal name.                                                               |
| `year`      | string     | Year of publication.                                                        |
| `authors`   | string[]   | List of credited authors.                                                   |
| `tl_dr`     | string     | Short 1–2 sentence summary of the article.                                  |
| `tags`      | string[]   | High-level thematic keywords describing the article’s focus.                |
| `key_terms` | string[]   | Important terms/concepts extracted for indexing/search.                     |
| `quotes`    | string[]   | Key direct excerpts from the article text.                                  |
| `score`     | number     | Vector similarity score from MongoDB Atlas `$vectorSearch`. Higher = closer.|
| `rank`      | number     | Final rank assigned after reranking (1 = most relevant).                    |
| `reason`    | string     | LLM-generated explanation of why the article was chosen and how it relates. |
