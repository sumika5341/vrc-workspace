const vrcData = [
    {
        title: "【Unity-Avatar】久々に開いたUnityプロジェクトがセーフモードを推奨してくるとき Part1",
        body: `
            <h3>概要</h3>
            <p>アバター改変のため、久々のプロジェクトを開こうとすると、Unityがセーフモードで実行するように推奨してきた。</p>
            <p>そのままセーフモードで起動すると、コンソールに以下のエラーログが出ていた。</p>
            <pre><code>
            Assets\nHaruka\PCSS4VRC\Script\Runtime\PCSS4VRC_NDMF.cs(67,39): error CS0246: The type or namespace name 'PCSS4VRC_MaterialAnimationCreator' could not be found (are you missing a using directive or an assembly reference?)
            </code></pre>
            <p><code>error CS0246</code>：名前は出てくるが、その中身（クラスや型）がどこに定義されているのか不明な状態。</p>

            <h3>原因</h3>
            <p>考えられる原因として、主に以下の３つが挙げられる。</p>
            <ul>
            <li>インポート失敗：PCSS4VRCの一部のファイルがしっかりインポートできていない。</li>
            <li>依存関係（NDMF）の不在：PCSS4VRCを動かすために必要なNDMFがプロジェクトに正しく入っていない。</li>
            <li>Assembly Definitionの不整合：プログラムの「グループ分け（asmdef）」がうまくいってなくて、隣のファイルが見えなくなっている。</li>
            </ul>

            <h3>対処</h3>
            <p>以下の手順で進め、復旧に成功した。</p>
            <ol>
            <li>Non-Destructive Modular Frameworkを更新</li>
            <li>PCがめちゃ重たくなりフリーズしかけたため一旦Unityをシャットダウン（NDMFの更新で実行中のプロジェクトファイルに負荷がかかった？）</li>
            <li>再起動し、リアル影システムを再インポートするもエラーは変わらず</li>
            <li>SDK含め、VCC上のアセットすべてをアップデートしてみるもダメ</li>
            <li>nHarukaフォルダごとプロジェクトから削除</li>
            <li>セーフモードは解除されたが、Sceneは何もセットされておらず</li>
            <li>Sceneを格納していたフォルダを確認すると問題なかったため、Hierarchyに上げなおし再セット</li>
            <li>nHarukaフォルダがないせいかマテリアルエラー頻発のため、PCSSを再インストール</li>
            <li>全て問題なく復旧完了！</li>
            </ol>
        `
    },
    {
        title: "【Tips】Unityでよく使うショートカット",
        body: `
            <h3>💻 覚えておくと便利なやつ</h3>
            <p>これを使うと爆速で作業できます。</p>
            <pre><code>Ctrl + D : オブジェクトの複製
Q / W / E / R : ツール切り替え</code></pre>
         Que;
        `
    },
    {
        title: "【TODO】今週やりたい改変メモ",
        body: `
            <h3>目指せ今週末メンテ！</h3>
            <ul>
                <li>新衣装のフィッティング</li>
                <li>お気に入りのアクセサリーのギミック実装</li>
            </ul>
        `
    } // 👈 新しいのを増やすときは、ここにコンマ（,）を打って同じように追加するだけ！
];
