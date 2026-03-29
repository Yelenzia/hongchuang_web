UPDATE cms_site_page
SET title = '让 AI 真正服务 Minecraft 创作与社区协作',
    subtitle = '鸿创工作室以 AI + Minecraft 为核心方向，正在推进 AI 模型、AI 贴图、AI 插件平台与创作者社区建设，为玩家、服主与开发者提供更高效、更智能的创作体验。',
    content_json = '{"badgeText":"AI + Minecraft Studio","heroButtons":[{"text":"进入论坛","link":"/forum","type":"primary"},{"text":"资源中心","link":"/resources","type":"plain"},{"text":"团队联系","link":"/contact","type":"plain"}],"directions":[{"name":"AI 模型能力","desc":"整合文本理解、内容生成与创意辅助能力，为创作场景提供底层支持。","style":"grass"},{"name":"AI 贴图与素材","desc":"面向贴图、模型和视觉素材生产，构建更高效的美术工作流。","style":"stone"},{"name":"AI 插件平台","desc":"服务服主与开发者的插件分发、展示、交流与生态协作入口。","style":"ore"}],"capabilities":[{"title":"AI 模型","desc":"面向内容创作、资源生成和辅助设计的模型能力预留。"},{"title":"AI 贴图","desc":"更贴近 Minecraft 风格的视觉资产生成与管理。"},{"title":"AI 插件平台","desc":"让服主与开发者更方便地发现、交流与分发插件。"},{"title":"创作者社区","desc":"承载论坛讨论、资源展示、私信沟通和内容协作。"}]}'
WHERE page_code = 'HOME';
