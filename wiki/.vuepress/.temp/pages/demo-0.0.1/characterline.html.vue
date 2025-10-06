<template><div><h2 id="人物关系图谱" tabindex="-1"><a class="header-anchor" href="#人物关系图谱"><span>人物关系图谱</span></a></h2>
<RelationGraph
  :height="460"
  :nodes='[
    { "id": "EK",  "label": "灵动骑士", "url": "/demo-0.0.1/character/superhero/character-EtherealKnight.html", "image": "/images/EK-avatar.png" },
    { "id": "SX",  "label": "舒雪",       "url": "/demo-0.0.1/character/superhero/character-HearTone.html",      "image": "/images/SX-avatar.png" },
    { "id": "HXN", "label": "韩梓宁",    "image": "/image/EtherealKnightCombatSuit.png" },
    { "id": "JHZ", "label": "金华煌（王子）" }
  ]'
  :edges='[
    { "from": "EK", "to": "SX",  "label": "朋友", "type": "friend" },
    { "from": "EK", "to": "HXN", "label": "朋友", "type": "ally"   },
    { "from": "EK", "to": "JHZ", "label": "宿敌", "type": "enemy"  }
  ]'
/>
</div></template>


