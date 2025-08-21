# set the organization profile trust center draft

- **Method:** `PUT`
- **Path:** `/v1/organizations/{id}/trust-center/draft`
- **Tag:** `Organization`
- **operationId:** `put_v1-organizations-id-trust-center-draft`

## Description
set the organization profile trust center draft

## Path Parameters
- `id` (**required**) — organization id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "about": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "maxLength": 1500,
          "description": "about the company"
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "security_statement": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "maxLength": 1500,
          "description": "company security statement"
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "trust_center": {
      "type": "object",
      "properties": {
        "value": {
          "description": "company trust center",
          "type": "object",
          "properties": {
            "active": {
              "type": "boolean"
            },
            "open_graph_url": {
              "type": "string"
            },
            "header_image_url": {
              "type": "string"
            },
            "header_color": {
              "type": "string"
            },
            "favicon_url": {
              "type": "string"
            },
            "text_color": {
              "type": "string"
            },
            "button_color": {
              "type": "string"
            },
            "button_text_color": {
              "type": "string"
            },
            "background_color": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "team": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "first_name": {
                "type": "string"
              },
              "last_name": {
                "type": "string"
              },
              "job_title": {
                "type": "string"
              },
              "email": {
                "type": "string",
                "format": "email",
                "pattern": "^.+@.+$"
              },
              "linkedin": {
                "type": "string"
              },
              "twitter": {
                "type": "string"
              },
              "visible": {
                "type": "boolean"
              }
            },
            "additionalProperties": false,
            "description": "company profile team member"
          },
          "description": "list of team members"
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "announcements": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              },
              "topic": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "published_at": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "title"
            ],
            "description": "company profile announcement"
          },
          "description": "list of announcements"
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "compliance": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "frameworks": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "list of frameworks file names (from scc metadata)"
            },
            "new_frameworks": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "framework": {
                    "type": "string"
                  },
                  "maturity_level": {
                    "type": "string"
                  },
                  "auditor": {
                    "type": "string"
                  },
                  "expiration_date": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "associated_document": {
                    "type": "string"
                  },
                  "visible": {
                    "type": "boolean"
                  },
                  "in_trust_center": {
                    "type": "boolean"
                  }
                },
                "additionalProperties": false,
                "description": "company profile compliance"
              },
              "description": "company compliance frameworks"
            },
            "other": {
              "type": "string",
              "maxLength": 1500,
              "description": "other compliance framework that is not in the ssc metadata"
            }
          },
          "additionalProperties": false
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "documents": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "evidence_id": {
                "type": "string"
              },
              "visible": {
                "type": "boolean"
              }
            },
            "additionalProperties": false,
            "description": "company profile document"
          },
          "description": "list of documents"
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    },
    "website": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "maxLength": 100,
          "description": "company website"
        },
        "visibility": {
          "type": "string",
          "description": "visibility of the section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    }
  },
  "additionalProperties": true,
  "description": "update trust center profile request"
}
```

## Responses
### 200
company profile
```json
{
  "type": "object",
  "properties": {
    "overview": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "description": "company overview description"
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "about": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "description": "about the company"
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "security_statement": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "description": "company security statement"
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "authentication": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "description": "the status of multi-factor authorization in organization"
            },
            "comment": {
              "type": "string",
              "description": "organization comment on multi-factor authorization"
            }
          },
          "additionalProperties": false,
          "required": [
            "status"
          ]
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "ciso": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "exists": {
              "type": "boolean",
              "description": "true if the ciso exists in the company"
            },
            "first_name": {
              "type": "string",
              "description": "ciso first name"
            },
            "last_name": {
              "type": "string",
              "description": "ciso last name"
            },
            "email": {
              "type": "string",
              "description": "ciso work email address"
            },
            "title": {
              "type": "string",
              "description": "ciso title"
            }
          },
          "additionalProperties": false,
          "required": [
            "exists"
          ]
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "trust_center": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "active": {
              "type": "boolean"
            },
            "open_graph_url": {
              "type": "string"
            },
            "header_image_url": {
              "type": "string"
            },
            "header_color": {
              "type": "string"
            },
            "favicon_url": {
              "type": "string"
            },
            "text_color": {
              "type": "string"
            },
            "button_color": {
              "type": "string"
            },
            "button_text_color": {
              "type": "string"
            },
            "background_color": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "security_grades": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "filters": {
              "type": "object",
              "properties": {
                "over_all_grade": {
                  "type": "string"
                },
                "factor_visibility": {
                  "type": "number"
                }
              },
              "additionalProperties": false,
              "required": [
                "over_all_grade",
                "factor_visibility"
              ]
            },
            "visibility": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "additionalProperties": false,
          "required": [
            "filters",
            "visibility"
          ]
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "team": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "first_name": {
                "type": "string"
              },
              "last_name": {
                "type": "string"
              },
              "job_title": {
                "type": "string"
              },
              "email": {
                "type": "string",
                "format": "email",
                "pattern": "^.+@.+$"
              },
              "linkedin": {
                "type": "string"
              },
              "twitter": {
                "type": "string"
              },
              "visible": {
                "type": "boolean"
              }
            },
            "additionalProperties": false,
            "description": "company profile team member"
          }
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "trusted_by": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "domain": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "name",
              "domain"
            ],
            "description": "company profile trusted by"
          }
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "announcements": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              },
              "topic": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "published_at": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "title"
            ],
            "description": "company profile announcement"
          }
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "compliance": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "frameworks": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "company compliance frameworks based on ssc frameworks metadata"
            },
            "new_frameworks": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "framework": {
                    "type": "string"
                  },
                  "maturity_level": {
                    "type": "string"
                  },
                  "auditor": {
                    "type": "string"
                  },
                  "expiration_date": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "associated_document": {
                    "type": "string"
                  },
                  "visible": {
                    "type": "boolean"
                  },
                  "in_trust_center": {
                    "type": "boolean"
                  }
                },
                "additionalProperties": false,
                "description": "company profile compliance"
              },
              "description": "company compliance frameworks"
            },
            "other": {
              "type": "string",
              "description": "some other framework that is not in the ssc metadata"
            }
          },
          "additionalProperties": false
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "documents": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "evidence_id": {
                "type": "string"
              },
              "visible": {
                "type": "boolean"
              }
            },
            "additionalProperties": false,
            "description": "company profile document"
          }
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "two_factor": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "exists": {
              "type": "boolean",
              "description": "true if the company has two factor authentication"
            }
          },
          "additionalProperties": false,
          "required": [
            "exists"
          ]
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "scorecard_comment": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "description": "comment on scorecard"
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "competitors": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "domain": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "domain"
            ],
            "description": "company profile competitor"
          }
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "security_txt": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "description": "security.txt link"
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "security_txt_values": {
      "type": "object",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "value": {
                "type": "string"
              },
              "link": {
                "type": "string"
              },
              "label": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "label"
            ],
            "description": ""
          }
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "website": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "description": "company website"
        },
        "user": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user name (email)"
            },
            "first_name": {
              "type": "string",
              "description": "user first name"
            },
            "last_name": {
              "type": "string",
              "description": "user last name"
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "user roles"
            }
          },
          "additionalProperties": false,
          "required": [
            "username",
            "first_name",
            "last_name",
            "roles"
          ],
          "description": "updater user"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
          "description": "updated date"
        },
        "visibility": {
          "type": "string",
          "description": "visibility status of the profile section"
        }
      },
      "additionalProperties": false,
      "required": [
        "value",
        "user",
        "updated"
      ]
    },
    "published": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "Date of last publication"
    },
    "employees_count": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "min": {
              "type": "number",
              "description": "min number of employees"
            },
            "max": {
              "type": "number",
              "description": "max number of employees"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false,
      "required": [
        "value"
      ]
    }
  },
  "additionalProperties": false,
  "description": "company profile"
}
```

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//v1/organizations/<id>/trust-center/draft' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

