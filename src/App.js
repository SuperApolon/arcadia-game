import React, { useState, useEffect, useRef, useCallback } from "react";

// @@SECTION:PALETTE
const C = {
  bg:"#050d14", panel:"#0a1a26", panel2:"#0d2235",
  border:"#1a4a6a", accent:"#00c8ff", accent2:"#00ffcc",
  gold:"#f0c040", red:"#ff4466", text:"#c8e8f8",
  muted:"#4a7a9a", white:"#eef8ff"
};

// @@SECTION:SCENES
const SCENES = [
  { bg:["#050d14","#0a1820","#152838"], loc:"VRS接続中", sprites:[], dl:[
    { sp:"SYSTEM", t:"── VRS接続を開始します ──\n\nブレイン・サーバーに接続中..." },
    { sp:"SYSTEM", t:"接続完了。\n\nようこそ、冒険者よ。\n五感で体感するVRMMORPG──\n\n『ARCADIA』の世界へ。" },
    { sp:"SYSTEM", t:"プレイヤー名: Eltz  Lv: 1\n\nゲームを開始します──", next:1 }
  ]},
  { bg:["#0a1a30","#1a5080","#d4c8a0"], loc:"旅立ちの浜辺", sprites:["🧑"], dl:[
    { sp:"エルツ", t:"「煙い。なんだよ、始まりって\n結構雑なんだな」" },
    { sp:"エルツ", t:"大きく呼吸をする。海辺に流れる空気は\n澄んでいた。\n\n「ここが、ゲームの世界か」" },
    { sp:"エルツ", t:"「噂には聞いてたけど、本当に綺麗だな……\n\n現実と比べて遜色のない圧倒的な存在感。\nこれがVRSのプレゼンスってやつか」" },
    { sp:"エルツ", t:"「さて、まずは村を探すのがセオリーかな」\n\n旅立ちの浜辺。ここが全ての始まり──", next:2 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 海岸線", sprites:["🧑","🌿"], dl:[
    { sp:"ナレーション", t:"旅立ちの浜辺から海岸線を進むこと約一時間──\n\nイルカ島の自然が視界に広がる。" },
    { sp:"エルツ", t:"「見たことない鳥だ……あれもモンスターなんだろうか」\n\n頭上には白い翼に黒の斑点を持った\n鳥々が飛び交っていた。" },
    { sp:"SYSTEM", t:"⚠ 近くにモンスターの気配を感じる……\n\nどうする？", choices:[
      { t:"⚔ 戦って進む", battle:true, battleType:"seagull", battleNext:3 },
      { t:"💨 避けて進む", next:3 }
    ]}
  ]},
  { bg:["#0a1808","#203818","#302820"], loc:"エルム村", sprites:["🧑","👤"], dl:[
    { sp:"エルツ", t:"「着いた……村だ」\n\n花と木々に包まれた村が視界に広がった。" },
    { sp:"旅人", t:"「君、初心者かい？\n\n情報を集めたいなら、まずはギルドで\n講習を受けるといいよ。\nほら、奥の大きな建物がギルドだよ」" },
    { sp:"エルツ", t:"「ありがとうございます」", next:4 }
  ]},
  { bg:["#1a0e06","#3a2010","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"高い天井、囲炉裏から立ち上る煙。\n銀髪の青年と金髪の少女がくつろいでいた。" },
    { sp:"スウィフト", t:"「初心者講習？　ギルドの人が出払ってるんだ。\nここ座りなよ。僕はスウィフト、こっちはリンス」" },
    { sp:"エルツ", t:"「エルツです。よろしく」" },
    { sp:"スウィフト", t:"「エルツってMMO好きなの？\nなんで好きなわけ？」" },
    { sp:"エルツ", t:"「なぜか……あらためて問われると\n答えがたいけど」", choices:[
      { t:"「人の存在を感じられるから」", next:5 },
      { t:"「世界観を楽しみたいから」", next:5 }
    ]}
  ]},
  { bg:["#1a0e06","#3a2010","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","🐰"], dl:[
    { sp:"ナレーション", t:"談笑していると──\nギルドの外から甲高い怒声が聞こえてきた。" },
    { sp:"クリケット", t:"「全クモッテ、ふ・ざ・け・て・るデシ！\nたかが生肉の一ツで殴り合いとは\n愚の骨頂デシ！」" },
    { sp:"エルツ", t:"「う、うぉぉぉ、何だ！？」\n\n背丈の小さな毛むくじゃらの生物が現れた。\n兎の耳に猫の髭──" },
    { sp:"クリケット", t:"「申し遅れたデシ。我輩がギルドマスターの\n[クリケット]デシ！\n\n手を前に出して『ブック・オープン！』\nと言うデシ」", pbOpen:true }
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","📖"], dl:[
    { sp:"SYSTEM", t:"── パーソナル・ブック（P.B.）取得 ──\n\n✨ 新機能が解放されました！" },
    { sp:"クリケット", t:"「携帯パソコンのようなものだと\n思って構わないデシ。\n\nステータス、メール、マップ──\n全情報がここに集まるデシ」" },
    { sp:"クリケット", t:"「下のナビから [P.BOOK] を押して\n確認できるデシよ。\n超重要事項だから絶対覚えるデシ！」" },
    { sp:"ナレーション", t:"かくして、エルツの冒険は始まった。\n\nアルカディア──\n夢に見た理想郷の扉が、今、\n開かれようとしている。", next:7 }
  ]},
  { bg:["#0a1808","#184018","#2a2818"], loc:"エルム村 ギルド裏・草地", sprites:["🧑","🐰","🙍"], dl:[
    { sp:"ナレーション", t:"クリケットに連れられ村の裏手の草地へ──\n光のカーテンのような木漏れ日が差し込む。" },
    { sp:"クリケット", t:"「まずホームポイントを設定するデシ。\n女神様の像に向かって\n『ホームポイント・オン』と言うデシ」" },
    { sp:"SYSTEM", t:"── ホームポイント 設定 ──\n\n📍 エルム村 女神像前\n死亡時にここへ戻ることができます" },
    { sp:"クリケット", t:"「次は戦闘講習デシ。\nあそこのラヴィを狩ってみるデシ！」" },
    { sp:"三人", t:"「……無理だ」\n\n草地でぴょこぴょこ跳ねる\n丸くてモコモコの桃色の生物──\n三人は口を揃えて言った。\n「可愛い過ぎる」" },
    { sp:"クリケット", t:"「…………代わりを用意するデシ」\n「コーザ！ お前が戦うデシ！」" },
    { sp:"コーザ", t:"「馬鹿も休み休み言って下さい。\n何で僕が戦わなくちゃならないんですか！」\n\n「……まぁ仕方ないですね。手加減はできませんよ」", battle:true, battleType:"koza", battleNext:8 }
  ]},
  { bg:["#0a1808","#184018","#2a2818"], loc:"エルム村 ギルド裏・草地", sprites:["🧑","🙍"], dl:[
    { sp:"ナレーション", t:"あっという間の一閃に三人は倒れた。\nだが──エルツは立ち上がった。\n\n三度目の突進でコーザの左胸に\n銅のナイフが突き刺さる──\nクリティカルヒット！" },
    { sp:"コーザ", t:"「有り得ない……\nまさか初心者に膝付かされるなんて\n夢にも思わなかったですよ」" },
    { sp:"クリケット", t:"「あの動き見事だったデシ。\n久々にいいもの見たデシ」" },
    { sp:"コーザ", t:"「勝てない状況では逃げることを\n最優先に考えなさい。\nそれがこの世界で生き残るコツですよ」" },
    { sp:"SYSTEM", t:"── 初心者講習 完了 ──\n\n🎖 初心者講習卒業の証 を入手した！\n物理攻撃力・物理防御力 +1" },
    { sp:"ナレーション", t:"講習を終えた頃、辺りは\n美しい赤焼けの夕暮れに染まっていた。\n\n旅立ち行く三人の冒険者。\nクリケットとコーザはその姿が\n見えなくなるまで見送った。", next:9 }
  ]},
  { bg:["#100a00","#1a1006","#0a0804"], loc:"エルム村 宿屋", sprites:["🧑","🧑‍🦱","👩","👵"], dl:[
    { sp:"ナレーション", t:"夕方、クリケットに教えられた宿屋へと向かう三人。\n\n木造の温かみある建物。\n扉を開けると囲炉裏の煙と食事の香りが漂ってきた。" },
    { sp:"老婆", t:"「部屋かい？\n部屋なら空いとるよ。\nもっとも空いてない事なんてないわな」\n\n「あんたらルーキーだろう？\nあの子は無茶するから大変じゃったろう」" },
    { sp:"スウィフト", t:"「はい。今日ギルドで初心者講習受けてきたとこなんですよ」" },
    { sp:"老婆", t:"「そうかえそうかえ。\n\nこのタブレットにサインを書いておくれ。\nチェックアウトは明日の午前十時が規定じゃ」" },
    { sp:"SYSTEM", t:"── チェックイン ──\n\n🏨 エルム村 宿屋\n1泊 20 ELK\n\nHPとMPが全回復しました", innRest:true },
    { sp:"エルツ", t:"「自分の部屋か……\n\nなんか、あまりにも現実と変わらない事に\n感動するのは変かな」" },
    { sp:"エルツ", t:"「僕らはこの世界で衣食住をしてるんだ。\n\n紛れも無く、ここには現実とは別の次元の\nもう一つの現実が広がってるんだ」" },
    { sp:"ナレーション", t:"ベッドに横になり、ふと現実世界の事を考え、\nエルツはすぐに考える事を止めた。\n\nそもそも、ここへ来たのは\nそんな現実世界から逃れるために\nやってきたのだから。", next:10 }
  ]},
  { bg:["#0a1206","#1a2a0a","#100e04"], loc:"エルム村 レミングスの酒場", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"木々に囲まれたオープンテラス。\n蔓で吊り下げられたランプが淡い光を漏らす。\n\nそこがレミングスの酒場だった。" },
    { sp:"スウィフト", t:"「とりあえず席だけ取っとこう。\n\n折角だからさ、だって酒場だし。\n飲む？」" },
    { sp:"エルツ", t:"「いや……折角だから──\n\nビール追加」" },
    { sp:"スウィフト", t:"「なんだよ、結局飲むんじゃん！」" },
    { sp:"ナレーション", t:"テーブルの中央にふわっと光が漂い、\nビールのジョッキが三つ現れた。" },
    { sp:"スウィフト", t:"「ジョッキかよ！」\n\n「それじゃ、三人の出会いを祝って──\n乾杯！」" },
    { sp:"エルツ", t:"「ああ、生き返る！」" },
    { sp:"ナレーション", t:"記念すべきこの世界での一日目の夜。\n温かい食事に気づけば酔いも回り、\nあっという間に過ぎてゆく時間。\n\n心地よい仲間との出会いによって\n飾られていた。", next:11 }
  ]},
  { bg:["#0a1a30","#1a5080","#8ab8c8"], loc:"イルカ島 海岸線", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"翌朝──\n\n宿屋を出た三人は村の外へ。\n穴道を抜けると澄み渡った青空と\n広大な蒼海が広がっていた。" },
    { sp:"エルツ", t:"「なんか、昨日来たって感じがしないな。\nずっと昔に来たみたいだ」" },
    { sp:"スウィフト", t:"「それだけ、昨日一日が濃密だったって事だよ」" },
    { sp:"ナレーション", t:"体長五十センチ程の大きなヤドカリのような生物が\n無数に群がっている──" },
    { sp:"エルツ", t:"「あれが……シャメロット？\n\nPBのMapScanで確認すると……Lv1か」" },
    { sp:"スウィフト", t:"「どうする？　やってみる？」" },
    { sp:"エルツ", t:"「行こう。\n\nまず一匹、様子を見ながら戦ってみよう」", battle:true, battleType:"shamerlot", battleNext:12 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"何とか一匹を討伐。\n\n甲殻を剣で叩き続けること数分──\n光の粒子となって岩蟹は消えた。" },
    { sp:"エルツ", t:"「あれ、経験値が入ってない？」" },
    { sp:"スウィフト", t:"「パーティだと経験値入らないのかな？」" },
    { sp:"SYSTEM", gainExp:"shamerlot", t:"ソロで再挑戦の結果──\nEXP +20 獲得！\n\nパーティでの経験値には\n自分より強いLvのモンスターと\n戦う必要があることが判明。" },
    { sp:"ナレーション", t:"そうして三人は各自でシャメロットを狩り始めた。\n\n仮想現実の世界で汗を流しながら、\nエルツは静かに力を蓄えていた。", next:13 }
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 交易所", sprites:["🧑","🧑‍🦱","👩","👨","👩‍🦰"], dl:[
    { sp:"ナレーション", t:"昼食をレミングスの酒場で取りながら、\n一同は今後の計画を練っていた。" },
    { sp:"エルツ", t:"「まず情報収集だ。\nこの世界のルールを把握しないと\n先へは進めない」" },
    { sp:"SYSTEM", t:"── 売却 ──\n\nシャメロットの甲羅 x3\n▶ 75 ELK 獲得\n\n所持金 合計: 175 ELK", sellElk:75 },
    { sp:"ローズ", t:"「買い方がわからないの？\nPBを出して。\n\nインデックスで Viewer という項目を選ぶの。\nそこで MapScan っていう項目を選ぶの」", mapScanUnlock:true },
    { sp:"エルツ", t:"「へぇ、こんな機能が。\nありがとうございます、ローズさん」" },
    { sp:"ローズ", t:"「試練の洞窟ならギルドに行けば\n情報聞けるよ。\n\nあと……ジュダ！\nこの子達に少し教えてあげて」" },
    { sp:"ジュダ", t:"「……まぁ頑張れよ」\n\nそれだけ言うと、ジュダは\nまた手元の作業へ戻っていった。" },
    { sp:"エルツ", t:"「変な奴だったけど、\nなぜか嫌いじゃなかったな」", next:14 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"道具屋を後にした一行は\n再びシャメロットが群がる岩場へ──\n\n岩場には先客の姿があった。\n背丈の小さい少年が、懸命に\n岩蟹と格闘している。" },
    { sp:"チョッパー", t:"「えいっ、えいっ……！」" },
    { sp:"エルツ", t:"「今は各自で狩ろう。\nいざというときはフォローし合えるように\nあまり離れないようにしておこう」" },
    { sp:"ナレーション", t:"そうして三人はそれぞれシャメロットを狩り始めた。\n\nその時──", next:15 }
  ]},
  { bg:["#0a1808","#1a2808","#301008"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"チョッパー", t:"「うわぁ！\n\n助けて！！」" },
    { sp:"ナレーション", t:"突然聞こえた悲鳴に\n三人の視線がその声の主を追う──\n\n少年の身体が赤く発光し、\n点滅を始めた。\n\n⚠ HPが危険域──赤信号！" },
    { sp:"スウィフト", t:"「やばい、あの子のHP！」" },
    { sp:"エルツ", t:"「行くぞ、二人とも！」" },
    { sp:"ナレーション", t:"Lv3のシャメロットが少年に迫る。\nエルツは剣を抜いて駆けた──", battle:true, battleType:"shamerlot_lv3", battleNext:16 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"エルツ", t:"「危うく死ぬとこだった。\nいやぁ、むやみに善意で突っ込むもんじゃないね」" },
    { sp:"スウィフト", t:"「いやいや、瀕死で助けに突っ込む\nその姿こそ美しい」" },
    { sp:"チョッパー", t:"「……たすけてくれたの？」" },
    { sp:"エルツ", t:"「うん。怪我は大丈夫？」" },
    { sp:"チョッパー", t:"「うん……ありがとう」\n\n少年は静かに、だがはっきりと\nそう言った。" },
    { sp:"エルツ", t:"「チョッパーか。\nよかったら一緒に狩りしよう。\nこっちもちょうど人手が欲しかったんだ」" },
    { sp:"ナレーション", t:"四人の冒険が、今始まる。", next:17 }
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 武器屋", sprites:["🧑","🧑‍🦱","👩","👦","🧓"], dl:[
    { sp:"ナレーション", t:"翌日──\n\n四人はエルム村の武器屋・防具屋へ。\n岩蟹を狩り続けて貯めたELKで\n装備を整える時が来た。" },
    { sp:"スウィフト", t:"「俺、槍にする。\nコーザとの戦いで間合いの\n大切さが分かったから」" },
    { sp:"店主", t:"「銅の剣なら87 ELK、\n銅の槍は95 ELK、\n銅の弓は110 ELK、\n銅の短剣は72 ELKだよ」" },
    { sp:"エルツ", t:"「……買えるか確認しよう」", choices:[
      { t:"⚔ 銅の剣を購入する（87 ELK）", buy:"sword" },
      { t:"💰 もう少し考える", next:18 }
    ]}
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 防具屋", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"SYSTEM", t:"── 装備購入 ──\n\n⚔ 銅の剣 を入手した！\n物理攻撃力 +6" },
    { sp:"エルツ", t:"「帽子……買うか。\n\n残りのELKとの兼ね合いで\n今買えるのはこれが限界だな」" },
    { sp:"SYSTEM", t:"── 装備購入 ──\n\n🎩 旅人の帽子 を入手した！\n物理防御力 +3", sellElk:-123 },
    { sp:"チョッパー", t:"「チョッパーも短剣買えた！」" },
    { sp:"ナレーション", t:"四人それぞれが自分に合った\n武器を手にした。\n\n与えられた環境の中で、\n最大限に力を引き出す──\n\nそれがエルツの信条だった。", next:19 }
  ]},
  { bg:["#0a1a30","#1a5080","#8ab8d0"], loc:"イルカ島 船着場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"装備を整えた翌日──\n\n四人は島の海岸線を北上した。\n小さな桟橋が見えてきた。" },
    { sp:"ナレーション", t:"桟橋の先には、\n眩しいほどの光を放つ大きな門が立っていた。\n\n────────\n洗礼の門（オラクルゲート）\n────────\n\n洗礼を受けた者のみ\nここを通ることができる" },
    { sp:"エルツ", t:"「洗礼……か」\n\n「つまりあの向こうに\n次の大陸があるってことだ」" },
    { sp:"チョッパー", t:"「あの光、きれいだね……」" },
    { sp:"エルツ", t:"「でもその前に──\nまだこの島でやることがある」", next:20 }
  ]},
  { bg:["#0a1808","#183818","#1a2010"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩","👦","👧"], dl:[
    { sp:"ナレーション", t:"ギルドへ戻った四人を\n一人の少女が出迎えた。\n\n明るい雰囲気の、\n人懐っこそうな少女だった。" },
    { sp:"ユミル", t:"「あ、初心者の人たち！\n\nもしかして試練の洞窟、\nまだ行ってない感じ？」" },
    { sp:"ユミル", t:"「じゃあちょうどよかった！\n\n私、ホワイトガーデンって\nコミュニティに入ってるんだけど、\n一緒にどう？\n\n試練の情報なら全部教えられるよ！」" },
    { sp:"エルツ", t:"「コミュニティ……」", choices:[
      { t:"「ぜひ入れてください」", joinCom:true },
      { t:"「もう少し考えます」", next:21 }
    ]}
  ]},
  { bg:["#0a1808","#183818","#1a2010"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩","👦","👧"], dl:[
    { sp:"SYSTEM", t:"── コミュニティ加入 ──\n\n🌸 White Garden に参加しました\n\nメンバー: ユミル、エルツ、スウィフト、リンス、チョッパー" },
    { sp:"ユミル", t:"「やった！\n\nじゃあ試練の洞窟について\n教えるね。\n\n奥を目指して進んでいくと\n急に開ける場所があるの。\n\nそこにアイツ──Simuluu がいるから」" },
    { sp:"エルツ", t:"「Simuluu……ボスか」" },
    { sp:"ユミル", t:"「うん。でも皆で協力すれば\n絶対倒せるから！\n\n気をつけて。\n頑張ってね」" },
    { sp:"ナレーション", t:"ユミルの言葉と笑顔が、\n四人の背中を押した。\n\n試練の洞窟──\nその名を胸に刻み、\n四人は明日への準備を始める。", next:22 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"それからシャメロットを狩り続ける日々──\n\n一日に狩りができる時間は限られている。\n体力的にも四時間半が今の限界だった。\n\nだが不思議と、飽きる事はなかった。" },
    { sp:"スウィフト", t:"「今日、何匹目？」" },
    { sp:"エルツ", t:"「わかんない、もういちいち数えてないよ」" },
    { sp:"ナレーション", t:"エルツがそう答えたその時だった──\n\n突然、エルツの身体が\n煌びやかな光に包まれた。", battle:true, battleType:"shamerlot", battleNext:23 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"そんなやり取りを交わしながら、\n一同は再び狩りへと戻っていった。\n\n過程を楽しむ事こそが、\nエルツのゲームに対する信条だった。", next:24 }
  ]},
  { bg:["#1a0e06","#3a2010","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩","👦","🙍","🤓"], dl:[
    { sp:"ナレーション", t:"あれから二週間──\n\n懸命に岩蟹を狩り続けた四人は、\n装備を整え、試練の洞窟へ向かう\n時が来たと判断していた。" },
    { sp:"コーザ", t:"「皆さんの旅はまだ始まったばかり。\n\nこれから皆さんの旅路が\n輝きあるものになるよう、\nここで祈らせて頂きますよ」" },
    { sp:"コーザ", t:"「皆さんの旅路に光あれ。\n御武運を」\n\n扉から光が溢れ──\n緑々しい自然と青空が広がる。", next:25 }
  ]},
  { bg:["#0a1a30","#1a5080","#8ab8c8"], loc:"イルカ島 西海岸", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"ギルド裏口から伸びる西の海岸線──\n\n海岸線を北上した先に、\nその洞窟はぽっかりと口を開けて\n冒険者達を待ち構えていた。" },
    { sp:"スウィフト", t:"「そう不安になる事ないよチョッパー。\nゲームっていうのは\n必ず攻略できるように作られてるんだ」" },
    { sp:"チョッパー", t:"「……うん」" },
    { sp:"エルツ", t:"「行こう、みんな」", next:26 }
  ]},
  { bg:["#020818","#0a2040","#0d3860"], loc:"試練の洞窟 ─ 青の洞窟", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"薄暗い洞窟内に入ると──\n\n一面に広がる青の世界。\n\n浸水した海水は紺碧の輝きを放ち、\nその輝きは洞窟全体を\n青く照らし上げていた。" },
    { sp:"スウィフト", t:"「嘘……だろ」" },
    { sp:"ナレーション", t:"その純正な青色は、\n今まで彼らが目にしたどんな色よりも\n美しく、そして神聖だった。" },
    { sp:"スウィフト", t:"「こんな綺麗な光景、初めて見た。\n\nあの木漏れ日の草地も綺麗だと\n思ったけど……ここは段違いだ」" },
    { sp:"ナレーション", t:"スウィフトは水面に一歩近づき、\n水をすくう。\n\n手から零れる青色の雫が舞い、\n地表に落下し溶け込んでゆく──" },
    { sp:"エルツ", t:"「行こう、奥へ」\n\n「皆、今のうちに装備と\nステータスを確認しとこう」" },
    { sp:"ナレーション", t:"美しい青の水面を踏みしめながら、\n四人は一歩一歩、洞窟の奥へと\n進んでいった。", next:27 }
  ]},
  { bg:["#010610","#050e28","#0a1840"], loc:"試練の洞窟 ─ 最深部", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"空間は唐突に一同の前に開けた。\n\n空気はいつの間にか\nはっきりとした冷気へと変わっていた。" },
    { sp:"ナレーション", t:"青い水面の上を、\nゆっくりと這う白影。\n\n滑らかな灰白肌の処々には\n白化した貝殻がこびりつき、\n長い首に沿って白い鬣が生え、\n頭部から天に向かう雄々しい鹿角──" },
    { sp:"エルツ", t:"「あれが……Simuluu」" },
    { sp:"ナレーション", t:"「Ｃキュｕィィｉィｉｉ……！！！」\n\n洞窟内に響く鳴き声。\nそれは自らの領域に踏み込んだ\n侵入者への警告だった。\n\nその白亜の姿は、\n戦いを前にした一同にとって\nあまりにも美しかった。", next:28 }
  ]},
  { bg:["#010610","#050e28","#0a1840"], loc:"試練の洞窟 ─ 最深部", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"エルツ", t:"「どうも、いつまでも見惚れてる\n場合じゃなさそうだな」" },
    { sp:"エルツ", t:"「とりあえず散開。\n\nリンスは遠距離から後方援護。\n僕ら三人は近距離から\nトライアングル陣形で攻撃しよう」" },
    { sp:"スウィフト", t:"「また随分と大まかな指示な事で」" },
    { sp:"ナレーション", t:"シムルーの周辺の水面に\n直径一メートル程の水球が浮かび上がる──\n\n「またあのタマ！！」\n\n水球は揺ら揺らと漂い、\n一同目掛けて飛来する！", battle:true, battleType:"simuluu", battleNext:29 }
  ]},
  { bg:["#020818","#0a2040","#0d3860"], loc:"試練の洞窟 ─ 青の洞窟", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"水面に倒れた偉大なる主を前に、\nそこには今まさに試練を乗り越えた\n者達の姿があった。\n\n青の洞窟内に舞う、\n四人のシルエット。" },
    { sp:"エルツ", t:"「……やった」" },
    { sp:"スウィフト", t:"「勝った！！」" },
    { sp:"チョッパー", t:"「やったやった！！」" },
    { sp:"ナレーション", t:"大量のライフエナジーが\n洞窟内に散って行く、\nその様子は美しくも儚い。\n\nその存在に敬意を払いながら、\nエルツ達はこの戦いを\n自らの糧とした。", next:30 }
  ]},
  { bg:["#0a1206","#1a2a0a","#100e04"], loc:"エルム村 レミングスの酒場", sprites:["🧑","🧑‍🦱","👩","👦","👧"], dl:[
    { sp:"ユミル", t:"「それでは、試練の洞窟\n無事突破を祝ってカンパーイ！」" },
    { sp:"ナレーション", t:"蔓に吊るされたランプの明かりの元へ\n一斉に突き出される杯。\n\n乾杯と同時に盛大に\nアップルジュースを零すチョッパー。" },
    { sp:"エルツ", t:"「楽勝！　楽勝だったよなチョッパー」" },
    { sp:"ユミル", t:"「こっちはびびったんですけど！」" },
    { sp:"ユミル", t:"「皆さんがこれから向かう大陸\n─ Lexia ─ では\n魔法は日常的に見る光景ですよ」" },
    { sp:"エルツ", t:"「─ Lexia ─ か。\n楽しみだな」" },
    { sp:"エルツ", t:"「皆、人間の最も強い欲望って\n何だと思う？」" },
    { sp:"スウィフト", t:"「何だよそれ。\nまた下らない事だったら怒るぞ」" },
    { sp:"エルツ", t:"「排泄欲だよ」" },
    { sp:"スウィフト", t:"「お前、ここまで引っ張っといて\n下ネタか。\n\nいい加減にしろよ酔っ払い！」" },
    { sp:"ナレーション", t:"新世界への憧憬という\n最高の酒のツマミを手に、\nその日もまたいつまでも\n語り合う冒険者達の姿があった。\n\n旅立ちの日は明日──\nそこからまた新たな世界が広がるのだ。", ending:true }
  ]}
];

// @@SECTION:BATTLE_CONFIG
const BATTLE_SKILLS = [
  { id:"atk",   label:"攻撃",    icon:"⚔",  color:"#00ffcc", cost:0,  dmg:[12,20] },
  { id:"skill", label:"スキル",  icon:"✨",  color:"#60a5fa", cost:15, dmg:[22,35] },
  { id:"guard", label:"防御",    icon:"🛡",  color:"#a78bfa", cost:0,  dmg:[0,0]   },
  { id:"item",  label:"アイテム",icon:"🧪",  color:"#f0c040", cost:0,  dmg:[0,0]   },
];
const BATTLE_DEFS = {
  seagull:       { name:"カモメ型モンスター", em:"🦅", maxHp:55,  atk:[8,18],  elk:20,  exp:15,  lv:1, bg:["#0a1628","#0d2a5e","#1a5fa0"], isFloating:true  },
  koza:          { name:"コーザ（訓練）",     em:"🙍", maxHp:120, atk:[10,18], elk:0,   exp:0,   lv:1, bg:["#0a1808","#184018","#2a2818"] },
  shamerlot:     { name:"シャメロット Lv.1",  em:"🦀", maxHp:80,  atk:[6,12],  elk:30,  exp:20,  lv:1, bg:["#0a1808","#184010","#283020"] },
  shamerlot_lv3: { name:"シャメロット Lv.3",  em:"🦀", maxHp:130, atk:[10,18], elk:50,  exp:40,  lv:3, bg:["#0a1808","#1a2808","#301008"] },
  simuluu:       { name:"Simuluu ─ 試練の主", em:"🦌", maxHp:400, atk:[15,25], elk:200, exp:200, lv:6, bg:["#010610","#050e28","#0a1840"], isBoss:true },
};

// @@SECTION:UTILS
const randInt = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const EXP_TABLE = [0,30,80,160,280,450,700];

// @@SECTION:MAIN_COMPONENT
export default function Arcadia() {
  // @@SECTION:STATE_ADVENTURE
  const [phase, setPhase] = useState("title");
  const [sceneIdx, setSceneIdx] = useState(0);
  const [dlIdx, setDlIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(false);
  const [choices, setChoices] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [pbTab, setPbTab] = useState(0);
  const [fade, setFade] = useState(false);
  const [notif, setNotif] = useState(null);
  const [lvUpInfo, setLvUpInfo] = useState(null);
  const [showStatUI, setShowStatUI] = useState(false);

  // @@SECTION:STATE_PLAYER
  const [hp, setHp] = useState(100);
  const [mhp, setMhp] = useState(100);
  const [mp, setMp] = useState(80);
  const [mmp, setMmp] = useState(80);
  const [elk, setElk] = useState(50);
  const [lv, setLv] = useState(1);
  const [exp, setExp] = useState(0);
  const [weapon, setWeapon] = useState("銅の短剣");
  const [statPoints, setStatPoints] = useState(0);
  const [statAlloc, setStatAlloc] = useState({patk:0,pdef:0,matk:0,spd:0});
  const [hasPb, setHasPb] = useState(false);
  const [hasMapScan, setHasMapScan] = useState(false);
  const [inCom, setInCom] = useState(false);

  // @@SECTION:STATE_BATTLE
  const [battleEnemy, setBattleEnemy] = useState(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [btlLogs, setBtlLogs] = useState([]);
  const [guarding, setGuarding] = useState(false);
  const [victory, setVictory] = useState(false);
  const [defeat, setDefeat] = useState(false);
  const [turn, setTurn] = useState(0);
  const [battleNext, setBattleNext] = useState(null);
  const [btlAnimEnemy, setBtlAnimEnemy] = useState(false);
  const [btlAnimPlayer, setBtlAnimPlayer] = useState(false);

  const typeTimerRef = useRef(null);
  const notifTimerRef = useRef(null);

  // @@SECTION:LOGIC_TYPEWRITER
  const startType = useCallback((text, onDone) => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    setTyping(true);
    setDisplayText("");
    let i = 0;
    const tick = () => {
      if (i >= text.length) { setTyping(false); onDone && onDone(); return; }
      const ch = text[i];
      setDisplayText(text.slice(0,i+1));
      i++;
      const delay = /[。！？…]/.test(ch) ? 120 : ch==="\n" ? 80 : 28;
      typeTimerRef.current = setTimeout(tick, delay);
    };
    tick();
  }, []);

  const showNotif = useCallback((msg) => {
    setNotif(msg);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotif(null), 2800);
  }, []);

  const showDl = useCallback((sIdx, dIdx) => {
    const sc = SCENES[sIdx];
    if (!sc) return;
    const dl = sc.dl[dIdx];
    if (!dl) return;

    // Handle events
    if (dl.pbOpen) setHasPb(true);
    if (dl.mapScanUnlock) { setHasMapScan(true); showNotif("📡 MapScan 解放！"); }
    if (dl.innRest) {
      setHp(h => { const v = Math.max(h, mhp); return v; });
      setMp(m => { const v = Math.max(m, mmp); return v; });
      setHp(mhp); setMp(mmp);
      showNotif("🏨 HP・MP が全回復した！");
    }
    if (dl.sellElk) {
      setElk(e => e + dl.sellElk);
      if (dl.sellElk > 0) showNotif(`💰 ${dl.sellElk} ELK 獲得！`);
    }
    if (dl.gainExp) {
      const ed = BATTLE_DEFS[dl.gainExp];
      if (ed) handleExpGain(ed.exp);
    }
    if (dl.joinCom) setInCom(true);

    // Battle
    if (dl.battle) {
      const eKey = dl.battleType || "seagull";
      const ed = BATTLE_DEFS[eKey];
      setBattleEnemy(ed);
      setEnemyHp(ed.maxHp);
      setBtlLogs([`⚔ ${ed.name} との戦闘が始まった！`]);
      setGuarding(false);
      setVictory(false);
      setDefeat(false);
      setTurn(0);
      setBattleNext(dl.battleNext !== undefined ? dl.battleNext : sIdx + 1);
      setPhase("battle");
      return;
    }

    // Ending
    if (dl.ending) {
      startType(dl.t, () => setTimeout(() => { setFade(true); setTimeout(() => { setPhase("end"); setFade(false); }, 600); }, 1200));
      return;
    }

    startType(dl.t, () => {
      if (dl.choices) setChoices(dl.choices);
    });
  }, [mhp, mmp, showNotif, startType]);

  const handleExpGain = useCallback((amount) => {
    setExp(e => {
      const ne = e + amount;
      const threshold = EXP_TABLE[lv] || 9999;
      if (ne >= threshold && lv < 6) {
        const newLv = lv + 1;
        setLv(newLv);
        setMhp(h => h + 10);
        setHp(h => Math.min(h + 10, mhp + 10));
        setMmp(m => m + 5);
        setStatPoints(sp => sp + 3);
        setLvUpInfo({ oldLv: lv, newLv });
        return ne - threshold;
      }
      return ne;
    });
    showNotif(`✨ EXP +${amount}！`);
  }, [lv, mhp, mmp, showNotif]);

  useEffect(() => {
    if (phase === "game") {
      setChoices(null);
      showDl(sceneIdx, dlIdx);
    }
  }, [phase, sceneIdx, dlIdx]);

  // @@SECTION:LOGIC_DIALOG_TAP
  const onTapDlg = useCallback(() => {
    if (choices) return;
    if (typing) {
      if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      const sc = SCENES[sceneIdx];
      const dl = sc?.dl[dlIdx];
      if (dl) setDisplayText(dl.t);
      setTyping(false);
      if (sc?.dl[dlIdx]?.choices) setChoices(sc.dl[dlIdx].choices);
      return;
    }
    // Advance
    const sc = SCENES[sceneIdx];
    const dl = sc?.dl[dlIdx];
    if (!dl) return;
    if (dl.choices) return;

    if (dl.next !== undefined) {
      setFade(true);
      setTimeout(() => { setSceneIdx(dl.next); setDlIdx(0); setFade(false); }, 300);
    } else {
      const nextDl = dlIdx + 1;
      if (nextDl < sc.dl.length) { setDlIdx(nextDl); }
      else {
        const nextSc = sceneIdx + 1;
        if (nextSc < SCENES.length) { setFade(true); setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300); }
      }
    }
  }, [choices, typing, sceneIdx, dlIdx]);

  // @@SECTION:LOGIC_CHOICE
  const onChoice = useCallback((ch) => {
    setChoices(null);
    if (ch.buy === "sword") {
      if (elk >= 87) {
        setElk(e => e - 87);
        setWeapon("銅の剣");
        showNotif("⚔ 銅の剣を購入した！");
        const nextSc = sceneIdx + 1;
        setFade(true);
        setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300);
      } else {
        showNotif("💸 ELKが足りない！");
        const nextDl = dlIdx + 1;
        const sc = SCENES[sceneIdx];
        if (nextDl < sc.dl.length) setDlIdx(nextDl);
      }
      return;
    }
    if (ch.joinCom) {
      setInCom(true);
      showNotif("🌸 White Garden に加入した！");
      const nextSc = sceneIdx + 1;
      setFade(true);
      setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300);
      return;
    }
    if (ch.battle) {
      const eKey = ch.battleType || "seagull";
      const ed = BATTLE_DEFS[eKey];
      setBattleEnemy(ed);
      setEnemyHp(ed.maxHp);
      setBtlLogs([`⚔ ${ed.name} との戦闘が始まった！`]);
      setGuarding(false); setVictory(false); setDefeat(false); setTurn(0);
      setBattleNext(ch.battleNext !== undefined ? ch.battleNext : sceneIdx + 1);
      setPhase("battle");
      return;
    }
    if (ch.next !== undefined) {
      setFade(true);
      setTimeout(() => { setSceneIdx(ch.next); setDlIdx(0); setFade(false); }, 300);
    } else if (ch.reply !== undefined) {
      const nextDl = dlIdx + 1;
      const sc = SCENES[sceneIdx];
      if (nextDl < sc.dl.length) setDlIdx(nextDl);
    } else {
      const nextDl = dlIdx + 1;
      const sc = SCENES[sceneIdx];
      if (nextDl < sc.dl.length) setDlIdx(nextDl);
    }
  }, [elk, sceneIdx, dlIdx, showNotif]);

  // @@SECTION:LOGIC_BATTLE
  const doBattleAction = useCallback((skillId) => {
    if (victory || defeat) return;
    const sk = BATTLE_SKILLS.find(s => s.id === skillId);
    if (!sk) return;
    if (sk.cost > 0 && mp < sk.cost) { showNotif("MPが足りない！"); return; }

    let logs = [];
    let newEnemyHp = enemyHp;
    let newHp = hp;
    let newMp = mp;
    let newGuarding = false;
    setBtlAnimEnemy(true); setTimeout(() => setBtlAnimEnemy(false), 400);

    if (skillId === "guard") {
      newGuarding = true;
      logs.push("🛡 防御態勢をとった！");
    } else if (skillId === "item") {
      const heal = randInt(20, 35);
      newHp = Math.min(hp + heal, mhp);
      logs.push(`🧪 アイテムを使用！ HP +${heal} 回復`);
    } else {
      if (sk.cost > 0) newMp = mp - sk.cost;
      const dmg = randInt(sk.dmg[0], sk.dmg[1]) + Math.floor(statAlloc.patk * 1.5);
      newEnemyHp = Math.max(0, enemyHp - dmg);
      logs.push(`${sk.icon} ${sk.label}！ ${battleEnemy?.name} に ${dmg} ダメージ！`);
    }

    // Enemy turn
    if (newEnemyHp > 0) {
      setBtlAnimPlayer(true); setTimeout(() => setBtlAnimPlayer(false), 400);
      const ed = battleEnemy;
      const eDmg = randInt(ed.atk[0], ed.atk[1]);
      const defBonus = newGuarding ? Math.floor(eDmg * 0.5) : 0;
      const actualDmg = Math.max(1, eDmg - defBonus - Math.floor(statAlloc.pdef * 1.2));
      newHp = Math.max(0, newHp - actualDmg);
      logs.push(newGuarding
        ? `🛡 防御！ ${ed.name}の攻撃を ${defBonus} 軽減 → ${actualDmg} ダメージ`
        : `💥 ${ed.name}の攻撃！ ${actualDmg} ダメージ`);
    }

    setHp(newHp);
    setMp(newMp);
    setEnemyHp(newEnemyHp);
    setGuarding(newGuarding);
    setTurn(t => t + 1);
    setBtlLogs(prev => [...prev, ...logs].slice(-8));

    if (newEnemyHp <= 0) {
      setVictory(true);
      setBtlLogs(prev => [...prev, `🏆 ${battleEnemy?.name}を倒した！`]);
      const ed = battleEnemy;
      if (ed.elk > 0) { setElk(e => e + ed.elk); showNotif(`💰 ${ed.elk} ELK 獲得！`); }
      if (ed.exp > 0) setTimeout(() => handleExpGain(ed.exp), 500);
    } else if (newHp <= 0) {
      setDefeat(true);
      setBtlLogs(prev => [...prev, "💀 戦闘不能…"]);
    }
  }, [victory, defeat, mp, enemyHp, hp, mhp, mmp, battleEnemy, statAlloc, showNotif, handleExpGain]);

  const exitBattle = useCallback(() => {
    if (defeat) {
      setHp(Math.floor(mhp * 0.3));
      setMp(Math.floor(mmp * 0.3));
      showNotif("💀 敗北… ホームポイントへ戻る");
    }
    const nextSc = battleNext !== null ? battleNext : sceneIdx;
    setFade(true);
    setTimeout(() => {
      setPhase("game");
      setSceneIdx(nextSc);
      setDlIdx(0);
      setFade(false);
    }, 400);
  }, [defeat, mhp, mmp, battleNext, sceneIdx, showNotif]);

  // ──────────── RENDER ────────────
  const sc = SCENES[sceneIdx] || SCENES[0];
  const bg = sc.bg;
  const bgStyle = { background: `linear-gradient(180deg, ${bg[0]} 0%, ${bg[1]} 50%, ${bg[2]} 100%)` };

  const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Share+Tech+Mono&display=swap');
    @keyframes idle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes blnk { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes dngr { 0%,100%{color:#ff4466} 50%{color:#ff9999} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
    @keyframes glow { 0%,100%{box-shadow:0 0 10px #00c8ff44} 50%{box-shadow:0 0 25px #00c8ff88,0 0 50px #00c8ff33} }
    @keyframes bossFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.03)} }
    @keyframes scanLine { 0%{top:0%} 100%{top:100%} }
    @keyframes notifIn { from{opacity:0;transform:translate(-50%,-20px)} to{opacity:1;transform:translate(-50%,0)} }
  `;

  // @@SECTION:RENDER_TITLE
  if (phase === "title") return (
    <div style={{width:"100%",height:"100%",minHeight:"600px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg,#020810 0%,#050d14 40%,#0a1828 100%)`,backgroundImage:`url(https://superapolon.github.io/Arcadia_Assets/title/title_bg.webp)`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"'Noto Serif JP',serif",position:"relative",overflow:"hidden"}}>
      <style>{keyframes}</style>
      {/* Scanline effect */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.015) 2px,rgba(0,200,255,0.015) 4px)",pointerEvents:"none",zIndex:1}}/>
      {/* Stars */}
      {[...Array(30)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:i%5===0?2:1,height:i%5===0?2:1,borderRadius:"50%",background:"#adf",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:0.3+Math.random()*0.5,animation:`blnk ${1.5+Math.random()*2}s ${Math.random()*2}s infinite`}}/>
      ))}

      <div style={{position:"relative",zIndex:2,textAlign:"center",animation:"fadeIn 1.5s ease"}}>
        <div style={{fontSize:11,letterSpacing:12,color:C.muted,marginBottom:16,fontFamily:"'Share Tech Mono',monospace"}}>VRMMORPG</div>
        <div style={{fontSize:72,fontWeight:700,letterSpacing:16,color:C.white,textShadow:`0 0 40px ${C.accent},0 0 80px ${C.accent}44`,lineHeight:1,marginBottom:8}}>ARCADIA</div>
        <div style={{fontSize:13,letterSpacing:4,color:C.accent2,marginBottom:48,fontFamily:"'Share Tech Mono',monospace",textShadow:`0 0 10px ${C.accent2}`}}>─── 理想郷への扉 ───</div>

        <div style={{width:280,height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`,margin:"0 auto 40px"}}/>

        <button
          onClick={() => { setPhase("game"); setSceneIdx(0); setDlIdx(0); }}
          style={{padding:"14px 48px",background:"transparent",border:`1px solid ${C.accent}`,color:C.accent,fontSize:16,letterSpacing:6,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",animation:"glow 2s infinite",transition:"all 0.3s"}}
          onMouseEnter={e => e.target.style.background = `${C.accent}22`}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >GAME START</button>

        <div style={{marginTop:24,fontSize:11,color:C.muted,letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>VRS CONNECT ▶</div>
      </div>
    </div>
  );

  // @@SECTION:RENDER_ENDING
  if (phase === "end") return (
    <div style={{width:"100%",height:"100%",minHeight:"600px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg,#030a06 0%,#0a1a0a 50%,#0d2010 100%)`,fontFamily:"'Noto Serif JP',serif",textAlign:"center",padding:40}}>
      <style>{keyframes}</style>
      <div style={{animation:"fadeIn 2s ease"}}>
        <div style={{fontSize:11,letterSpacing:12,color:C.muted,marginBottom:20,fontFamily:"'Share Tech Mono',monospace"}}>─ EPISODE 1 END ─</div>
        <div style={{fontSize:48,fontWeight:700,color:C.white,textShadow:`0 0 30px ${C.accent2}`,marginBottom:16}}>ARCADIA</div>
        <div style={{fontSize:18,color:C.accent2,letterSpacing:4,marginBottom:40}}>旅立ちの日は明日──</div>
        <div style={{width:240,height:1,background:`linear-gradient(90deg,transparent,${C.accent2},transparent)`,margin:"0 auto 32px"}}/>
        <div style={{fontSize:13,color:C.muted,lineHeight:2}}>
          <div>HP: {hp} / {mhp}</div>
          <div>Lv: {lv} &nbsp;│&nbsp; EXP: {exp}</div>
          <div>ELK: {elk}</div>
        </div>
        <button onClick={() => { setPhase("title"); setSceneIdx(0); setDlIdx(0); setElk(50); setHp(100); setMhp(100); setMp(80); setMmp(80); setLv(1); setExp(0); setWeapon("銅の短剣"); setStatPoints(0); setStatAlloc({patk:0,pdef:0,matk:0,spd:0}); setHasPb(false); setHasMapScan(false); setInCom(false); }} style={{marginTop:40,padding:"12px 40px",background:"transparent",border:`1px solid ${C.accent2}`,color:C.accent2,fontSize:14,letterSpacing:4,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer"}}>TITLE へ戻る</button>
      </div>
    </div>
  );

  // @@SECTION:RENDER_BATTLE
  if (phase === "battle") {
    const ed = battleEnemy;
    if (!ed) return null;
    const enemyPct = Math.max(0, enemyHp / ed.maxHp * 100);
    const playerPct = Math.max(0, hp / mhp * 100);
    const mpPct = Math.max(0, mp / mmp * 100);
    const isBoss = ed.isBoss;

    return (
      <div style={{width:"100%",height:"100%",minHeight:"600px",display:"flex",flexDirection:"column",background:`linear-gradient(180deg,${ed.bg[0]} 0%,${ed.bg[1]} 50%,${ed.bg[2]} 100%)`,fontFamily:"'Noto Serif JP',serif",userSelect:"none",position:"relative",overflow:"hidden"}}>
        <style>{keyframes}</style>
        {notif && <div style={{position:"absolute",top:20,left:"50%",transform:"translateX(-50%)",background:"rgba(10,26,38,0.95)",border:`1px solid ${C.accent}`,color:C.accent,padding:"8px 20px",fontSize:13,letterSpacing:1,zIndex:100,whiteSpace:"nowrap",fontFamily:"'Share Tech Mono',monospace",animation:"notifIn 0.3s ease"}}>{notif}</div>}

        {/* Enemy area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 20px 10px"}}>
          {isBoss && <div style={{fontSize:11,letterSpacing:6,color:C.red,fontFamily:"'Share Tech Mono',monospace",marginBottom:8,animation:"dngr 1s infinite"}}>─── BOSS ───</div>}
          <div style={{fontSize:isBoss?88:64,animation:isBoss?"bossFloat 2s infinite":"idle 2s infinite",filter:isBoss?`drop-shadow(0 0 20px ${C.red})`:"none",transform:btlAnimEnemy?"scale(1.1)":"scale(1)",transition:"transform 0.1s"}}>{ed.em}</div>
          <div style={{color:C.white,fontSize:15,fontWeight:700,marginTop:8,letterSpacing:2}}>{ed.name}</div>
          <div style={{width:200,height:8,background:C.panel2,borderRadius:4,margin:"8px auto 4px",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${enemyPct}%`,background:isBoss?`linear-gradient(90deg,${C.red},#ff8844)`:`linear-gradient(90deg,${C.accent2},${C.accent})`,transition:"width 0.4s",borderRadius:4}}/>
          </div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>{enemyHp} / {ed.maxHp}</div>
        </div>

        {/* Log */}
        <div style={{height:110,overflowY:"auto",padding:"8px 16px",background:"rgba(5,13,20,0.7)",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          {btlLogs.map((l,i) => (
            <div key={i} style={{fontSize:12,color:i===btlLogs.length-1?C.white:C.muted,lineHeight:1.7,animation:i===btlLogs.length-1?"slideUp 0.3s ease":"none"}}>{l}</div>
          ))}
        </div>

        {/* Player status */}
        <div style={{padding:"10px 16px",background:"rgba(10,26,38,0.9)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div>
              <span style={{fontSize:11,color:C.muted,marginRight:8,fontFamily:"'Share Tech Mono',monospace"}}>HP</span>
              <span style={{fontSize:13,color:playerPct<=25?C.red:C.accent2,fontFamily:"'Share Tech Mono',monospace",animation:playerPct<=25?"dngr 0.8s infinite":"none"}}>{hp}/{mhp}</span>
            </div>
            <div>
              <span style={{fontSize:11,color:C.muted,marginRight:8,fontFamily:"'Share Tech Mono',monospace"}}>MP</span>
              <span style={{fontSize:13,color:"#60a5fa",fontFamily:"'Share Tech Mono',monospace"}}>{mp}/{mmp}</span>
            </div>
            <div style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>Turn {turn}</div>
          </div>
          <div style={{height:4,background:C.panel2,borderRadius:2,marginBottom:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${playerPct}%`,background:`linear-gradient(90deg,${C.red},${C.accent2})`,transition:"width 0.4s"}}/>
          </div>
          <div style={{height:4,background:C.panel2,borderRadius:2,marginBottom:10,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${mpPct}%`,background:"linear-gradient(90deg,#2255cc,#60a5fa)",transition:"width 0.4s"}}/>
          </div>

          {/* Action buttons */}
          {!victory && !defeat ? (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
              {BATTLE_SKILLS.map(sk => (
                <button key={sk.id} onClick={() => doBattleAction(sk.id)}
                  style={{padding:"10px 4px",background:C.panel,border:`1px solid ${sk.color}44`,color:sk.color,fontSize:13,cursor:"pointer",borderRadius:4,transition:"all 0.2s",fontFamily:"'Noto Serif JP',serif"}}
                  onMouseEnter={e => { e.currentTarget.style.background = `${sk.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.panel; }}>
                  <div style={{fontSize:20}}>{sk.icon}</div>
                  <div style={{fontSize:11,marginTop:2}}>{sk.label}</div>
                  {sk.cost > 0 && <div style={{fontSize:9,color:C.muted}}>MP {sk.cost}</div>}
                </button>
              ))}
            </div>
          ) : (
            <div style={{textAlign:"center",padding:8}}>
              <div style={{fontSize:16,color:victory?C.gold:C.red,fontWeight:700,marginBottom:12,animation:"fadeIn 0.5s"}}>
                {victory ? "🏆 Victory！" : "💀 Defeat…"}
              </div>
              <button onClick={exitBattle} style={{padding:"10px 40px",background:"transparent",border:`1px solid ${victory?C.gold:C.muted}`,color:victory?C.gold:C.muted,fontSize:14,cursor:"pointer",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>
                {victory ? "続ける ▶" : "戻る ▶"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // @@SECTION:RENDER_GAME
  const dl = sc.dl[dlIdx] || sc.dl[0];
  const spColor = dl.sp === "SYSTEM" ? C.accent : dl.sp === "ナレーション" ? C.muted : C.accent2;
  const isHpLow = hp / mhp <= 0.25;

  return (
    <div style={{width:"100%",height:"100%",minHeight:"600px",display:"flex",flexDirection:"column",...bgStyle,fontFamily:"'Noto Serif JP',serif",userSelect:"none",position:"relative",overflow:"hidden",transition:"background 1s"}}>
      <style>{keyframes}</style>

      {/* Overlay fade */}
      {fade && <div style={{position:"absolute",inset:0,background:"#050d14",opacity:1,zIndex:50,transition:"opacity 0.3s"}}/>}

      {/* Notification */}
      {notif && <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",background:"rgba(5,13,20,0.95)",border:`1px solid ${C.accent}`,color:C.accent,padding:"8px 20px",fontSize:12,letterSpacing:1,zIndex:100,whiteSpace:"nowrap",fontFamily:"'Share Tech Mono',monospace",animation:"notifIn 0.3s ease",borderRadius:2}}>{notif}</div>}

      {/* Scanlines */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.01) 3px,rgba(0,200,255,0.01) 4px)",pointerEvents:"none",zIndex:1}}/>

      {/* HUD top */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",background:"rgba(5,13,20,0.7)",borderBottom:`1px solid ${C.border}`,zIndex:10,position:"relative"}}>
        <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>{sc.loc}</div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>
            <span style={{color:isHpLow?C.red:C.accent2,animation:isHpLow?"dngr 0.8s infinite":"none"}}>HP {hp}</span>
            <span style={{color:C.muted}}> / </span>
            <span style={{color:C.muted}}>{mhp}</span>
          </div>
          <div style={{fontSize:10,color:"#60a5fa",fontFamily:"'Share Tech Mono',monospace"}}>MP {mp}</div>
          <div style={{fontSize:10,color:C.gold,fontFamily:"'Share Tech Mono',monospace"}}>💰 {elk}</div>
          <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>Lv.{lv}</div>
        </div>
      </div>

      {/* Sprite area */}
      <div style={{flex:1,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"20px 20px 0",position:"relative",zIndex:5,minHeight:200}}>
        {/* Scene-specific atmosphere */}
        {sc.loc.includes("洞窟") && (
          <>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{position:"absolute",width:4,height:4,borderRadius:"50%",background:`rgba(0,100,255,${0.3+Math.random()*0.3})`,left:`${10+Math.random()*80}%`,top:`${Math.random()*80}%`,animation:`idle ${2+Math.random()*3}s ${Math.random()*2}s infinite`}}/>
            ))}
          </>
        )}
        <div style={{display:"flex",gap:16,alignItems:"flex-end",justifyContent:"center",flexWrap:"wrap"}}>
          {sc.sprites.map((sp, i) => (
            <div key={i} style={{fontSize:i===0?52:40,animation:`idle ${2+i*0.3}s ${i*0.2}s infinite`,filter:i===0?"drop-shadow(0 0 8px rgba(0,200,255,0.3))":"none",textShadow:"0 4px 8px rgba(0,0,0,0.5)"}}>{sp}</div>
          ))}
        </div>
      </div>

      {/* Dialog box */}
      <div style={{position:"relative",zIndex:10}} onClick={onTapDlg}>
        <div style={{background:"rgba(5,13,20,0.92)",border:`1px solid ${C.border}`,borderTop:`1px solid ${C.accent}44`,margin:"0 8px 4px",padding:"14px 18px 16px",minHeight:120,cursor:"pointer",backdropFilter:"blur(4px)"}}>
          {/* Speaker */}
          <div style={{fontSize:11,color:spColor,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,marginBottom:8,borderLeft:`2px solid ${spColor}`,paddingLeft:8}}>
            {dl.sp}
          </div>
          {/* Text */}
          <div style={{fontSize:14,color:C.white,lineHeight:1.9,whiteSpace:"pre-wrap",minHeight:60}}>
            {displayText}
            {typing && <span style={{animation:"blnk 0.5s infinite",color:C.accent}}>█</span>}
          </div>
          {/* Advance indicator */}
          {!typing && !choices && (
            <div style={{position:"absolute",bottom:10,right:16,fontSize:10,color:C.accent,animation:"blnk 1s infinite",fontFamily:"'Share Tech Mono',monospace"}}>▼</div>
          )}
        </div>

        {/* Choices */}
        {choices && !typing && (
          <div style={{display:"flex",flexDirection:"column",gap:6,padding:"0 8px 8px",animation:"slideUp 0.3s ease"}}>
            {choices.map((ch, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); onChoice(ch); }}
                style={{padding:"11px 16px",background:C.panel,border:`1px solid ${C.border}`,color:C.text,fontSize:13,textAlign:"left",cursor:"pointer",transition:"all 0.2s",fontFamily:"'Noto Serif JP',serif",letterSpacing:0.5}}
                onMouseEnter={e => { e.currentTarget.style.background = C.panel2; e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border; }}>
                {ch.t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{display:"flex",background:"rgba(5,13,20,0.95)",borderTop:`1px solid ${C.border}`,zIndex:20}}>
        {hasPb && (
          <button onClick={() => setOverlay(overlay==="pb"?null:"pb")}
            style={{flex:1,padding:"10px 4px",background:"transparent",border:"none",color:overlay==="pb"?C.accent:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,borderRight:`1px solid ${C.border}`}}>
            📖 P.BOOK
          </button>
        )}
        {lvUpInfo && (
          <button onClick={() => setOverlay("lvup")}
            style={{flex:1,padding:"10px 4px",background:`${C.gold}22`,border:"none",color:C.gold,fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,animation:"dngr 1s infinite",borderRight:`1px solid ${C.border}`}}>
            ⭐ LV UP!
          </button>
        )}
      </div>

      {/* P.BOOK Overlay */}
      {overlay === "pb" && (
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:30,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s"}}>
          <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${C.border}`,padding:"10px 16px"}}>
            <div style={{fontSize:11,letterSpacing:4,color:C.accent,fontFamily:"'Share Tech Mono',monospace",flex:1}}>P.BOOK</div>
            <button onClick={() => setOverlay(null)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace"}}>✕</button>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
            {["STATUS","MAIL","MAP"].map((tab,i) => (
              <button key={i} onClick={() => setPbTab(i)} style={{flex:1,padding:"8px 4px",background:"transparent",border:"none",borderBottom:pbTab===i?`2px solid ${C.accent}`:"2px solid transparent",color:pbTab===i?C.accent:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{flex:1,padding:16,overflowY:"auto"}}>
            {pbTab === 0 && (
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,lineHeight:2}}>
                <div style={{color:C.accent2,fontSize:14,marginBottom:12,letterSpacing:2}}>Eltz</div>
                {[
                  ["Lv", lv],
                  ["EXP", `${exp} / ${EXP_TABLE[lv] || "MAX"}`],
                  ["HP", `${hp} / ${mhp}`],
                  ["MP", `${mp} / ${mmp}`],
                  ["ELK", elk],
                  ["武器", weapon],
                  ["物理ATK", `+${statAlloc.patk}`],
                  ["物理DEF", `+${statAlloc.pdef}`],
                  ["魔法ATK", `+${statAlloc.matk}`],
                  ["敏捷", `+${statAlloc.spd}`],
                  ...(statPoints>0?[["未振り", `${statPoints} pt`]]:[]),
                  ...(inCom?[["コミュニティ","White Garden"]]:[]),
                ].map(([k,v]) => (
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:`1px solid ${C.border}44`}}>
                    <span style={{color:C.muted}}>{k}</span>
                    <span style={{color:C.text}}>{v}</span>
                  </div>
                ))}
                {statPoints > 0 && (
                  <button onClick={() => setOverlay("stat")} style={{marginTop:16,width:"100%",padding:"10px",background:C.panel,border:`1px solid ${C.gold}`,color:C.gold,fontSize:12,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:2}}>
                    ⭐ ステータス振り分け ({statPoints} pt)
                  </button>
                )}
              </div>
            )}
            {pbTab === 1 && (
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.muted}}>
                <div style={{color:C.accent,marginBottom:12,letterSpacing:2,fontSize:11}}>── MAIL ──</div>
                {hasPb ? (
                  <div style={{color:C.text,lineHeight:2}}>
                    <div style={{color:C.accent2,marginBottom:8}}>クリケットより</div>
                    <div style={{color:C.muted,fontSize:11,lineHeight:1.8}}>P.BOOKの初期設定を\n完了してください。\n\n冒険者よ、健闘を祈る！</div>
                    {inCom && (
                      <>
                        <div style={{color:C.accent2,marginBottom:8,marginTop:16}}>ユミルより</div>
                        <div style={{color:C.muted,fontSize:11,lineHeight:1.8}}>White Garden へようこそ！\n一緒に頑張ろうね。🌸</div>
                      </>
                    )}
                  </div>
                ) : <div>メールなし</div>}
              </div>
            )}
            {pbTab === 2 && (
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.muted}}>
                <div style={{color:C.accent,marginBottom:12,letterSpacing:2,fontSize:11}}>── MAP SCAN ──</div>
                {hasMapScan ? (
                  <div>
                    <div style={{background:C.panel,border:`1px solid ${C.border}`,padding:12,marginBottom:12}}>
                      <div style={{color:C.accent2,marginBottom:8}}>📍 現在地</div>
                      <div style={{color:C.white}}>{sc.loc}</div>
                    </div>
                    <div style={{color:C.muted,fontSize:11,lineHeight:2}}>
                      {["旅立ちの浜辺","エルム村","イルカ島 海岸線","イルカ島 岩場","試練の洞窟"].map(loc => (
                        <div key={loc} style={{padding:"4px 0",borderBottom:`1px solid ${C.border}44`,color:loc===sc.loc?C.accent:C.muted}}>
                          {loc===sc.loc?"▶ ":""}{loc}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div style={{color:C.muted}}>MapScan 未解放</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LvUp Overlay */}
      {overlay === "lvup" && lvUpInfo && (
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:30,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s"}}>
          <div style={{textAlign:"center",padding:32,border:`1px solid ${C.gold}`,background:C.panel,maxWidth:280}}>
            <div style={{fontSize:11,letterSpacing:6,color:C.gold,fontFamily:"'Share Tech Mono',monospace",marginBottom:16}}>LEVEL UP!</div>
            <div style={{fontSize:48,color:C.gold,textShadow:`0 0 20px ${C.gold}`,marginBottom:8}}>⭐</div>
            <div style={{fontSize:24,color:C.white,fontFamily:"'Share Tech Mono',monospace",marginBottom:20}}>Lv.{lvUpInfo.oldLv} → Lv.{lvUpInfo.newLv}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:2,fontFamily:"'Share Tech Mono',monospace",marginBottom:20}}>
              <div style={{color:C.accent2}}>MAX HP +10</div>
              <div style={{color:"#60a5fa"}}>MAX MP +5</div>
              <div style={{color:C.gold}}>ステータスポイント +3</div>
            </div>
            <button onClick={() => { setOverlay(null); setLvUpInfo(null); }}
              style={{padding:"10px 32px",background:"transparent",border:`1px solid ${C.gold}`,color:C.gold,fontSize:12,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:2}}>OK</button>
          </div>
        </div>
      )}

      {/* Stat Alloc Overlay */}
      {overlay === "stat" && (
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:30,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s"}}>
          <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${C.border}`,padding:"10px 16px"}}>
            <div style={{fontSize:11,letterSpacing:4,color:C.gold,fontFamily:"'Share Tech Mono',monospace",flex:1}}>ステータス振り分け</div>
            <button onClick={() => setOverlay("pb")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace"}}>戻る</button>
          </div>
          <div style={{flex:1,padding:16}}>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.gold,marginBottom:16}}>残りポイント: {statPoints}</div>
            {[
              {key:"patk",label:"物理攻撃力",color:C.accent2},
              {key:"pdef",label:"物理防御力",color:"#a78bfa"},
              {key:"matk",label:"魔法攻撃力",color:"#60a5fa"},
              {key:"spd", label:"敏捷力",    color:C.gold},
            ].map(({key,label,color}) => (
              <div key={key} style={{display:"flex",alignItems:"center",marginBottom:12,gap:8}}>
                <div style={{flex:1,fontSize:12,color:C.text,fontFamily:"'Share Tech Mono',monospace"}}>{label}</div>
                <div style={{fontSize:14,color,fontFamily:"'Share Tech Mono',monospace",minWidth:32,textAlign:"center"}}>{statAlloc[key]}</div>
                <button disabled={statPoints<=0} onClick={() => { if(statPoints>0){ setStatPoints(sp=>sp-1); setStatAlloc(sa=>({...sa,[key]:sa[key]+1})); }}}
                  style={{padding:"4px 12px",background:statPoints>0?`${color}22`:"transparent",border:`1px solid ${statPoints>0?color:C.border}`,color:statPoints>0?color:C.muted,cursor:statPoints>0?"pointer":"not-allowed",fontSize:12,fontFamily:"'Share Tech Mono',monospace"}}>
                  ＋
                </button>
                <button disabled={statAlloc[key]<=0} onClick={() => { if(statAlloc[key]>0){ setStatPoints(sp=>sp+1); setStatAlloc(sa=>({...sa,[key]:sa[key]-1})); }}}
                  style={{padding:"4px 12px",background:statAlloc[key]>0?`${C.muted}22`:"transparent",border:`1px solid ${statAlloc[key]>0?C.muted:C.border}`,color:statAlloc[key]>0?C.muted:C.border,cursor:statAlloc[key]>0?"pointer":"not-allowed",fontSize:12,fontFamily:"'Share Tech Mono',monospace"}}>
                  ─
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default Arcadia;
