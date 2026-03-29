USE hongchuang_platform;

UPDATE cms_site_page
SET title = '玩家、服主和创作者都能用得上的 Minecraft 社区',
    subtitle = '在这里你可以浏览资源、参与论坛讨论、查看公告、联系团队，也可以通过私信与其他成员交流合作。我们希望把常用功能做得更顺手，让创作、交流和分享都更轻松。',
    content_json = '{"badgeText":"Minecraft 创作社区","heroButtons":[{"text":"进入论坛","link":"/forum","type":"primary"},{"text":"资源中心","link":"/resources","type":"plain"},{"text":"团队联系","link":"/contact","type":"plain"}],"directions":[{"name":"发布和查找资源","desc":"集中浏览插件、贴图、模型和教程，查找需要的内容更方便。","style":"grass"},{"name":"加入社区讨论","desc":"发帖、评论、私信一步到位，交流想法会更直接。","style":"stone"},{"name":"认识更多同好","desc":"无论你是玩家、服主、开发者还是美术，都能在这里找到交流和合作机会。","style":"ore"}],"capabilities":[{"title":"资源发布","desc":"支持发布、整理和展示插件、贴图、模型等内容。"},{"title":"论坛讨论","desc":"围绕服务器、玩法、开发和创作话题自由交流。"},{"title":"私信沟通","desc":"支持点对点联系，方便继续交流、答疑和合作。"},{"title":"团队联系","desc":"官方联系方式和成员信息清晰可见，沟通更省心。"}]}'
WHERE page_code = 'HOME';

UPDATE cms_site_page
SET title = '团队联系',
    subtitle = '有合作、咨询或交流需求时，可以通过下面的方式联系到我们。',
    content_json = JSON_SET(COALESCE(content_json, '{}'), '$.brandText', '鸿创工作室 · Minecraft 创作与交流社区')
WHERE page_code = 'CONTACT';
