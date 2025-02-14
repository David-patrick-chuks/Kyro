import { SchemaType } from '@google/generative-ai'


export interface PostDataSchema {
	description: string
	type: SchemaType
	items: {
		type: SchemaType
		properties: {
			postContent: {
				type: SchemaType
				description: string
				nullable: boolean
			}
			viraRate: {
				type: SchemaType
				description: string
				nullable: boolean
			}
			postImageQuery: {
				type: SchemaType
				description: string
				nullable: boolean
			}
		}
		required: string[]
	}
}

export const getPostDataSchema = (): PostDataSchema => {
	return {
		description: `Schema for posting after viewing the JSON DATA for a user persona`,
		type: SchemaType.ARRAY,
		items: {
			type: SchemaType.OBJECT,
			properties: {
				postContent: {
					type: SchemaType.STRING,
					description: 'A post between 100 and 250 characters long. do not add hashtags',
					nullable: false,
				},
				viraRate: {
					type: SchemaType.NUMBER,
					description: 'The viral rate, meaning the rate of the content to go viral when posted, measured on a scale of 0 to 100.',
					nullable: false,
				},
				postImageQuery: {
					type: SchemaType.STRING,
					description: 'A precise image search query to fetch a exact image that matches the post via the Google Custom Search API',
					nullable: true,
				},
			},
			required: ['postContent', 'viraRate', 'postImageQuery'],
		},
	}
}

export interface CharacterSchema {
	description: string
	type: SchemaType
	properties: {
		fileName: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		name: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		password: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		email: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		profileVerification: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		profileImageQuery: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		age: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		gender: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		location: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		occupation: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		agentId: {
			type: SchemaType
			description: string
			nullable: boolean
		}
		settings: {
			type: SchemaType
			description: string
			properties: {
				voice: {
					type: SchemaType
					properties: {
						model: {
							type: SchemaType
							description: string
							nullable: boolean
						}
					}
					required: string[]
				}
			}
			required: string[]
		}
		bio: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
			}
			nullable: boolean
		}
		lore: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
			}
			nullable: boolean
		}
		knowledge: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
			}
			nullable: boolean
		}
		messageExamples: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
				properties: {
					userMessage: {
						type: SchemaType
						description: string
						nullable: boolean
					}
					agentRelytoMessage: {
						type: SchemaType
						description: string
						nullable: boolean
					}
				}
				required: string[]
			}
			nullable: boolean
		}
		postExamples: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
				properties: {
					user: {
						type: SchemaType
						description: string
						nullable: boolean
					}
					content: {
						type: SchemaType
						description: string
						nullable: boolean
					}
				}
				required: string[]
			}
			nullable: boolean
		}
		topics: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
			}
			nullable: boolean
		}
		style: {
			type: SchemaType
			description: string
			properties: {
				all: {
					type: SchemaType
					description: string
					items: {
						type: SchemaType
					}
					nullable: boolean
				}
				chat: {
					type: SchemaType
					description: string
					items: {
						type: SchemaType
					}
					nullable: boolean
				}
				post: {
					type: SchemaType
					description: string
					items: {
						type: SchemaType
					}
					nullable: boolean
				}
			}
			required: string[]
		}
		adjectives: {
			type: SchemaType
			description: string
			items: {
				type: SchemaType
			}
			nullable: boolean
		}
	}
	required: string[]
}
export const getCharacterSchema = (): CharacterSchema => {
	return {
		description: `Schema for configuring an AI agent with settings, bio, lore, knowledge, message examples, topics, style preferences, and adjectives.`,
		type: SchemaType.OBJECT,
		properties: {
			fileName: {
				type: SchemaType.STRING,
				description:
					'The file name of agent persona i.e (agentname.character.json as example elonMusk.character.json) note:: camelCase for ai agent name .',
				nullable: false,
			},
			name: {
				type: SchemaType.STRING,
				description: 'The name of the agent.',
				nullable: false,
			},
			profileImageQuery: {
				type: SchemaType.STRING,
				description: ' A precise image search query to fetch a exact profile image via the Google Custom Search API',
				nullable: false,
			},
			profileVerification: {
				type: SchemaType.BOOLEAN,
				description: 'The profileVerification blue tick of the agent.',
				nullable: false,
			},
			gender: {
				type: SchemaType.STRING,
				description: 'The gender of the agent.',
				nullable: false,
			},
			password: {
				type: SchemaType.STRING,
				description:
					'A 8 hard unique and strong random password for the agent account. randomize from here to create one :: "#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%$@!*?"',
				nullable: false,
			},
			email: {
				type: SchemaType.STRING,
				description: 'A unique and strong gmail email address with for the agent account.',
				nullable: false,
			},
			age: {
				type: SchemaType.STRING,
				description: 'The age of the agent.',
				nullable: false,
			},
			location: {
				type: SchemaType.STRING,
				description: 'The location of the agent.',
				nullable: false,
			},
			occupation: {
				type: SchemaType.STRING,
				description: 'The occupation of the agent.',
				nullable: false,
			},
			agentId: {
				type: SchemaType.STRING,
				description:
					"A unique identifier for the agent, formatted as 'aiAGENT_name_+ 6 randomn charaters supflix' i.e aiAGENT_name_589062",
				nullable: false,
			},
			settings: {
				type: SchemaType.OBJECT,
				description: 'Settings for the agent, including voice configuration.',
				properties: {
					voice: {
						type: SchemaType.OBJECT,
						properties: {
							model: {
								type: SchemaType.STRING,
								description: "The voice model for the agent (e.g., 'en_US-male-medium').",
								nullable: false,
							},
						},
						required: ['model'],
					},
				},
				required: ['voice'],
			},
			bio: {
				type: SchemaType.ARRAY,
				description:
					"An array of strings describing the agent's biography, note: must be minimum length of 160 char count",
				items: { type: SchemaType.STRING },
				nullable: false,
			},
			lore: {
				type: SchemaType.ARRAY,
				description: "An array of strings defining the agent's lore or backstory.",
				items: { type: SchemaType.STRING },
				nullable: false,
			},
			knowledge: {
				type: SchemaType.ARRAY,
				description: "An array of strings containing the agent's knowledge base.",
				items: { type: SchemaType.STRING },
				nullable: false,
			},
			messageExamples: {
				type: SchemaType.ARRAY,
				description: "Example QA message interactions for  (btw 'Friend' and 'Agent Name')",
				items: {
					type: SchemaType.OBJECT,
					properties: {
						userMessage: {
							type: SchemaType.STRING,
							description: 'The message content sent to the agent.',
							nullable: false,
						},
						agentRelytoMessage: {
							type: SchemaType.STRING,
							description: 'The agent reply to the user messsage content.',
							nullable: false,
						},
					},
					required: ['userMessage', 'agentRelytoMessage'],
				},
				nullable: false,
			},
			postExamples: {
				type: SchemaType.ARRAY,
				description: 'Examples of social media posts by the agent.',
				items: {
					type: SchemaType.OBJECT,
					properties: {
						user: {
							type: SchemaType.STRING,
							description: 'The user posting the example.',
							nullable: false,
						},
						content: {
							type: SchemaType.STRING,
							description: 'The post content.',
							nullable: false,
						},
					},
					required: ['user', 'content'],
				},
				nullable: false,
			},
			topics: {
				type: SchemaType.ARRAY,
				description: 'An array of topics the agent is proficient in.',
				items: { type: SchemaType.STRING },
				nullable: false,
			},
			style: {
				type: SchemaType.OBJECT,
				description: "The agent's style preferences for communication.",
				properties: {
					all: {
						type: SchemaType.ARRAY,
						description: 'General style adjectives.',
						items: { type: SchemaType.STRING },
						nullable: false,
					},
					chat: {
						type: SchemaType.ARRAY,
						description: 'Style preferences specific to chat interactions.',
						items: { type: SchemaType.STRING },
						nullable: false,
					},
					post: {
						type: SchemaType.ARRAY,
						description: 'Style preferences specific to posts.',
						items: { type: SchemaType.STRING },
						nullable: false,
					},
				},
				required: ['all', 'chat', 'post'],
			},
			adjectives: {
				type: SchemaType.ARRAY,
				description: 'A list of adjectives describing the agent.',
				items: { type: SchemaType.STRING },
				nullable: false,
			},
		},
		required: [
			'fileName',
			'name',
			'agentId',
			'settings',
			'bio',
			'lore',
			'knowledge',
			'messageExamples',
			'postExamples',
			'topics',
			'style',
			'adjectives',
			'profileImageQuery',
			'profileVerification',
			'gender',
			'password',
			'email',
		],
	}
}
