export interface ContentDraftItem {
  id: string
  draftType: 'POST' | 'RESOURCE' | string
  sceneCode?: string | null
  ownerUserId: string
  title?: string | null
  summary?: string | null
  contentMarkdown?: string | null
  extraData?: Record<string, any>
  status?: number
  autoSaved?: number
  createdAt: string
  updatedAt: string
}

export interface ContentTemplateItem {
  id: string
  templateName: string
  templateType: 'POST' | 'RESOURCE' | string
  sceneCode: string
  titleExample?: string | null
  summaryExample?: string | null
  contentMarkdown?: string | null
  extraData?: Record<string, any>
  enabled?: number
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
}
