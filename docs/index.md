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
