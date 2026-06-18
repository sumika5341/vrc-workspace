# VRC関係のトラブル ＆ Tips集

作業中のトラブルとその対応策、知った/編み出したテクニックをおいとくとこ。

---

## トラブルシューティング

<details>
<summary>【エラー】テンプレート</summary>

### 概要
概要を書くとこ。
### 原因
原因を書くとこ。
### 対処
対処方法を書くとこ。
</details>


<details>
<summary>【Unity-Avatar】久々に開いたUnityプロジェクトがセーフモードを推奨してくるとき Part1</summary>

### 概要
アバター改変のため、久々のプロジェクトを開こうとすると、Unityがセーフモードで実行するように推奨してきた。<br>
そのままセーフモードで起動すると、コンソールに以下のエラーログが出ていた。
```
Assets\nHaruka\PCSS4VRC\Script\Runtime\PCSS4VRC_NDMF.cs(67,39): error CS0246: The type or namespace name 'PCSS4VRC_MaterialAnimationCreator' could not be found (are you missing a using directive or an assembly reference?)
```
`error CS0246`：名前は出てくるが、その中身（クラスや型）がどこに定義されているのか不明な状態。

### 原因
考えられる原因として、主に以下の３つが挙げられる。
- インポート失敗：PCSS4VRCの一部のファイルがしっかりインポートできていない。
- 依存関係（NDMF）の不在：PCSS4VRCを動かすために必要なNDMFがプロジェクトに正しく入っていない。
- Assembly Definitionの不整合：プログラムの「グループ分け（asmdef）」がうまくいってなくて、隣のファイルが見えなくなっている。

### 対処
以下の手順で進め、復旧に成功した。
1. Non-Destructive Modular Frameworkを更新
2. PCがめちゃ重たくなりフリーズしかけたため一旦Unityをシャットダウン（NDMFの更新で実行中のプロジェクトファイルに負荷がかかった？）
3. 再起動し、リアル影システムを再インポートするもエラーは変わらず
4. SDK含め、VCC上のアセットすべてをアップデートしてみるもダメ
5. nHarukaフォルダごとプロジェクトから削除
6. セーフモードは解除されたが、Sceneは何もセットされておらず
7. Sceneを格納していたフォルダを確認すると問題なかったため、Hierarchyに上げなおし再セット
8. nHarukaフォルダがないせいかマテリアルエラー頻発のため、PCSSを再インストール
9. 全て問題なく復旧完了！

</details>


<details>
<summary>【Unity-Avatar】久々に開いたUnityプロジェクトがセーフモードを推奨してくるとき Part2</summary>

### 概要
android版でアバターをアップロードしようとすると、ロードが終わらなかったため、一度unityを落としてから再度プロジェクトを開こうとすると、またUnityがセーフモードで実行するように推奨してきた。<br>
そのままセーフモードで起動すると、コンソールに以下のエラーログが出ていた。
```
Packages\com.anatawa12.gists\Scripts\ActualPerformanceWindow\ActualPerformanceWindow.cs(553,68): error CS0656: Missing compiler required member 'Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo.Create'
```
`error CS0656`：Unityが計算をしようとしたら、使うはずのライブラリがみあたらず動けない状態。

### 原因
どこかの設定のミスマッチによるものだと思われる。

### 対処
anatawa12をALCOMで入れなおしたらセーフモードは解除された。

</details>


<details>
<summary>【Unity-Avatar】えれもーふが動かない！</summary>

### 概要
add componentからえれもーふを追加し、メッシュをいじろうとしても、ドット自体は動くが、メッシュが動かない。

### 原因
AAO remove by maskを併用していたせい。

### 対処
AAO remove系と相性が悪い可能性が高い。

</details>


<details>
<summary>【Unity-Avatar】Gesture Managerが動かない！</summary>

### 概要
Gesture Manager経由でplay modeに入ろうとしたが、いつまでたっても移行しない。

### 原因
リベラのsceneが多すぎて、読み込みにひたすら時間がかかっている説が濃厚。

### 対処
使用していないSceneをunloadにするのがよろし。<br>
そのSceneはplay modeで読み込まれなくなるので、その分読み込み時間を抑えられる。<br>
再びそのSceneを触りたいときは、同じ手順でunloadを解除すればOK。

</details>


<details>
<summary>【Unity-World】ワールドのアップロード失敗</summary>

### 概要
色々もちもちしたワールドをアップしようとしたら突如発生。<br>
エラーログは以下。
```
Failed to assign network IDs, 1 errors encountered!
Try using the Network ID Utility to resolve them.
UnityEngine.Debug:LogError (object,UnityEngine.Object)
VRC.Core.Logger:LogError (string,string,UnityEngine.Object)
AssignSceneNetworkIDs:OnPreprocessScene (UnityEngine.SceneManagement.Scene)
VRC.SDKBase.Editor.BuildPipeline.VRCBuildPipelineCallbacks:OnPreprocessScene (UnityEngine.SceneManagement.Scene)
VRC.SDK3.Editor.Builder.VRCWorldAssetExporter:ExportCurrentSceneResource (bool,System.Action`1<string>,System.Action`1<object>)
VRC.SDK3.Editor.Builder.VRCWorldBuilder:ExportSceneResourceInternal (bool)
VRC.SDK3.Editor.Builder.VRCWorldBuilder:ExportSceneResource ()
VRC.SDK3.Editor.VRCSdkControlPanelWorldBuilder/<Build>d__149:MoveNext () (at ./Packages/com.vrchat.worlds/Editor/VRCSDK/SDK3/VRCSdkControlPanelWorldBuilder.cs:2614)
UnityEngine.UnitySynchronizationContext:ExecuteTasks ()
```

⇒ネットワークIDの割り当てに失敗とのこと。<br>
VRCのワールドにあるギミックに、同期用のID（NWID）を配ろうとしたら、番号が重複していたり、バグっていたりで配れなくなっている状態。

### 原因
Udonがついたオブジェクトをhierarchy上で複製した場合などに発生しやすいとのこと。<br>
中の内部IDまで同じものが増えてしまったせいで、割り当てがぱにくった状態とみられる。

### 対処
VRChat SDK > Utilities > Network ID Utility<br>
出てきたウィンドゥ内のRegenerate Scene Network IDs、あるいはFix的なのがあればそれを押す。<br>
念のためプロジェクトをセーブしてから、リビルド。

</details>

---

## Tips

<details>
<summary>【Unity-World】Scene上でオブジェクトが遠い地点で視点が貫通してしまう</summary>

Sceneウィンドゥ右上の方にあるカメラアイコンを押して、Dynamic Clippingってのにチェックついてたら外してみて。

</details>


<details>
<summary>【Unity-World】透過入りの画像を入れても透けないとき</summary>

1. TextureのInspectorでTexture Typeを`Default`→`Sprite`にする。
2. MaterialのシェーダをTransparentCutoutにする。

</details>


<details>
<summary>【Unity-Avatar】アトラス化と関連知識</summary>
参考：https://note.com/hokkyokuguma810/n/n9759be4d654c#a48dc986-72be-4fc5-ac41-cd3014b60186

### アトラス化とは
AAO、TTTを活用して、materialを統合しスロットを減らす技。<br>
AAO：`AAO Merge Skinned Mesh`→AAOのコンポーネント。メッシュを合成するツール。（マテリアルはそのまま）<br>
TTT：`TTT Atlastexture`→テクスチャをまとめ、そのまま一つのマテリアルを生成するテクスチャ合成ツール。（メッシュはそのまま）<br>
→両方を使うことでようやく有用な軽量化につながる。

#### 名称の由来
アトラス＝ギリシャ神話の巨人の神アトラスが由来。<br>
アトラスは神々に反抗した罰として、生涯、天界（世界）を背負うことになった巨人。<br>
→ここから「世界を支える者」「全体をまとめる者」というイメージが定着したそうな。<br>
→そして、16世紀の地理学者メルカトルが、地図帳の表紙に世界を背負うアトラスの絵を描いたことから、地図帳のこともアトラスと呼ばれるようになった。<br>
→複数のもの（地図）を一つの大きなもの（地図帳）にまとめることをアトラス化と呼ばれるようになった。

#### アバターが描画されるまで
参考：https://note.com/dolce_vrc/n/nd32e504706f1
1. CPUが圧縮されたアバターデータをDLして展開 ※アバターに使われている画像はVRAMに置かれる
2. CPUがPBを物理演算し、全ボーンの位置を決定
3. CPUがメッシュごとに命令を出し、GPUがそれぞれ一気に形を計算 ←メッシュ統合により計算量を削減可能（AAO）
4. CPUがマテリアルスロットごとに命令を出し、GPUがそれぞれ一気に色を計算 ←マテリアル統合（アトラス化）で計算量を削減（TTT）

※CPUがGPUに命令を出すこと→ドローコール<br>
メッシュ、マテリアルスロットの数に比例して増える。<br>
→これを毎フレーム行うため、CPUが間に合わなくなると画面がかくつく。<br>
→また、VRAMが不足すると、PCのメモリが代用され、計算にエラーが発生しやすくなる。

### 簡単！軽量化STEP
1. AAOでメッシュ結合
2. TTTでMaterial結合
3. ポリゴン等をAAO等で削っていく（remove by blend shape等）
4. Textureの解像度落とせるだけ落とす
5. lilutilでごみを除去

</details>

<details>
<summary>【Unity-Avatar】テクスチャの種類と軽量化</summary>
参考：https://note.com/dolce_vrc/n/nd32e504706f1

### テクスチャの種類
|種類|概要|
|---|---|
|メインカラー|基本色|
|ノーマルマップ|光の反射方向を変え、凹凸を疑似再現|
|AOマップ|影の強さ指定|
|マットキャップ|てからない部分を黒塗りで指定|
|光沢マスク|鏡にしない部分を黒塗りで指定|

#### Mipmap
遠くから描画するとき用に元からサイズを落とした画像を用意しておく手法。<br>
合計テクスチャサイズは4/3倍になるが、必要な画像のみVRAMに展開（Streaming Mip Mpas）することで、結果的にVRAMを節約できる。

#### クランチ圧縮
DLサイズは小さくできるが、展開後のサイズは変わらない。<br>
むしろ、展開で負荷がかかるため使用は非推奨。

</details>

<details>
<summary>【Unity-Avatar】その他の軽量化</summary>

#### シェイプキーの固定
シェイプキーはあるだけで重いらしい。使用しないなら固定推奨（`AAO - Freeze BlendShape`）。

#### アニメータ
アニメータの遷移は構成方法により処理の重さが変わる。
AnyState形式 > Entry-Exit形式 > BlendTree形式 の順に重い
自動でやってくれるツール：`AAO Avatar Optimizer - Trace And Optimize`

#### PhysBone
[PBReplacer](https://github.com/c-colloid/PBReplacer-VPM)
[AAO Avatar Optimizer - Merge PhysBone](https://vpm.anatawa12.com/avatar-optimizer/ja/docs/reference/merge-physbone/)
[Amehuri Tools - PhysBoneを間引くやつ](https://github.com/amehuri/amehuri_tools)

#### テクスチャのサイズを非破壊で下げたい
[TexTransTool - TextureConfigurator](https://ttt.rs64.net/docs/Reference/TextureConfigurator)

#### ポリゴン数を間引きたい
[Meshia Mesh Simplification](https://ramtype0.github.io/Meshia.MeshSimplification/docs/ja/introduction.html)
★Kanameliser Editor Plusの併用を推奨）

</details>

<details>
<summary>【Unity-World】ピックアップオブジェクトを引き寄せないようにしたい</summary>

VRC Pickup コンポーネントの中の「Orientation」という設定値で変わる。
- Any：強制的にオブジェクトの基準点が、自分の手の位置にワープするような挙動。
- Hand / Grab：自分がオブジェクトをトリガーした瞬間の、手とオブジェクトの距離感や角度で固定される。

</details>

<details>
<summary>【Unity-World】サードパーティのフォントを利用したい</summary>
2026/06/12

### 導入手順
1. DLしたフォントファイル（.ttfや.otf）をUnityのProjectウィンドゥにD&Dする。
2. 上部メニューの Window > TexMeshPro > Font Asset Creator を開く。
3. 一番上の Source Font File に、先ほど入れたフォントファイルをD&Dする。
4. Character Set を Custom Characters に変更する。
5. その下の空欄（Custom Character List）に、https://yurinchi2525.com/fontlist/の文字列をコピペして入力する。<br>
※日本語は初期プリセットに含まれないため、このCustom Charactersですべて設定してあげる必要がある。
※また、数が多すぎてつぶれるため、画像サイズは2048*2048で設定。（アルファベットすら変換されなかったらこれを疑う）
6. 一番下の Generate Font Atlas を押して、少し待ったら Save を押して保存する。

### 利用方法
- 生成したフォントファイルを、文字を表示したいCanvasのFont Assetにセットすれば適用できる。

</details>

---

## 備忘録

<details>
<summary>【Unity-World】雑誌作成</summary>

### 使用ソフト
- Blender（モデリング、UV展開）
- CLIP STUDIO PAINT（テクスチャ作成）
- Unity（VRChatへの設置）

### 作成手順

#### Step 1：Blenderで形を作る（モデリング）
##### 初期立方体の変形
1. テンキー 7（真上）➔ S ➔ X で横幅を調整。
2. S ➔ Y で縦の長さを調整。
3. テンキー 1（真横）➔ S ➔ Z で雑誌の厚みまで極限に薄くする。
<br>※数値を直接指定したい場合は、Nキーでサイドバーを出し、「アイテム」➔「寸法（Dimensions）」に「210mm」などの単位付きで直接入力する。

##### スケールリセット
オブジェクトモードで雑誌を選択し、Ctrl + A ➔ 「スケール」 をクリック。
<br>（※これをやらないと、後のベベルやUV展開が歪む原因になる）

##### 背表紙丸み付け（ベベル）
1. `Tabキー`で編集モードに入り、`2キー`（辺選択）を押す。
2. 背表紙の左右の角（縦の線2本）を`Shift`を押しながら選択。
3. `Ctrl + B`を押し、マウスをゆっくり動かして角を割る。
4. マウスを動かした状態のまま、ホイールを上に2〜3回回して滑らかな丸みにして左クリックで決定。
<br>（※より滑らかに見せたい場合は、オブジェクトモードに戻り、右クリック ➔ 「スムーズシェード」を適用。）

#### Step 2：UV展開（展開図の作成と書き出し）
##### 自動展開
1. 画面上のタブを 「UV Editing」 に切り替える。
2. 右の3D画面で Tab（編集モード）➔ A（全選択）を押す。
3. Uキー ➔ 「スマートUV投影」 または 「展開」 を選んでポチる。

##### Asset風にパーツを離す（余白の設定）
1. 左のUV画面で A（全選択）➔ メニューの「UV」➔ 「アイランドをパッキング」 を選択。
2. 左下に出るパネルの 「余白 (Margin)」 の数値を 0.01〜0.02 程度に上げて、パーツ同士に隙間を作る。
<br>※さらに切り離したい場合は、切り離したいパーツを選択して`V`をおすことで切り離すことができる。

3. パーツの上下が逆さまになっている場合は、左のUV画面で A（全選択）➔ R ➔ 180 ➔ Enter で正しい向きに回転させる。

##### UVマップの書き出し
1. 左のUV画面のメニュー「UV」 ➔ 「UV配置をエクスポート」 をクリック。
2. 解像度（2048×2048など）を確認し、透明な背景のPNG画像として保存する。

##### 3Dモデルの書き出し
1. メニューの「ファイル」➔「エクスポート」➔「FBX (.fbx)」を選択。
2. 右側の設定でオブジェクトタイプを「メッシュ」のみに絞ってエクスポート。

#### Step 3：クリスタでテクスチャを描く
1. 書き出した「UVのPNG画像」をクリスタで開く。
2. UV線のレイヤーを一番上に配置し、不透明度を下げて「乗算」にする（ガイド線にする）。
3. UVの線を参考に、その下のレイヤーに表紙、裏表紙、背表紙のデザインを描き込む。
4. 完成したら、UV線のレイヤーを必ず非表示にして、デザイン画像（.png または .jpg）として書き出す。

#### Step 4：Unityで組み立てて配置する
##### アセットのインポート
UnityのProjectウィンドウ（Assets内）にフォルダを作り、Blenderの .fbx とクリスタの デザイン画像 をドラッグ＆ドロップ。

##### マテリアルの作成
1. Projectウィンドウで右クリック ➔ Create ➔ Material を選択。
2. マテリアルのInspectorウィンドウにある Base Map（または Albedo） の枠に、デザイン画像をドラッグ＆ドロップで割り当てる。
<br>（必要に応じて、Shaderを lilToon や VRChat/Mobile/Standard Lite など最適なものに変更する。）

##### 配置と仕上げ
1. .fbx（雑誌モデル）を Sceneビュー（またはHierarchy）にドラッグ＆ドロップしてワールドに召喚。
2. 作ったマテリアル（画像が貼られた球体）を、Scene上の雑誌に直接ドラッグ＆ドロップして適用。
3. 全体のサイズ感が気になれば、雑誌のInspectorにある Scale で微調整して完成！

</details>
