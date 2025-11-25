/**
 * StreamingChat - AI チャット処理関数
 * 
 * ユーザーの入力を受け取り、OpenAI APIにストリーミングリクエストを送信し、
 * リアルタイムでAIの応答を表示する。チャット履歴の管理も行う。
 * 
 * @param {Object} player - Empirica プレイヤーオブジェクト (チャット履歴の管理用)
 * @param {string} currentInput - ユーザーの入力メッセージ
 * @param {Function} setStreamingAssistantContent - ストリーミング中のコンテンツ更新関数
 * 
 * @returns {Promise<void>} 処理完了時に解決されるPromise
 */

export async function StreamingChat(player, stage, role, currentInput, setStreamingAssistantContent) {
    const currentStage = stage?.get('name');
    const currentPlayer = (!currentStage) ? player : player.round;
    const chatStorage = (!currentStage) ? "chatHistory-conversation" : "chatHistory-suggestion";

    // ローカルサーバーで実行している場合と、デプロイされたサーバーで実行している場合でAPIエンドポイントを切り替える
    // デプロイ時はCaddyがリバースプロキシとして機能するため、同一オリジンポリシーに従う
    const apiEndpoint = window.location.hostname === "localhost" ? "http://localhost:4000/api/chat" : "/api/chat";

    const newMessage = { role: role, content: currentInput };
    const currentMessages = Array.isArray(currentPlayer.get(chatStorage)) ? currentPlayer.get(chatStorage) : [];
    const messagesToSend = [...currentMessages, newMessage];
    currentPlayer.set(chatStorage, messagesToSend);

    if (chatStorage === "chatHistory-suggestion") {
        // この場で5秒待機する
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messagesToSend.map(m => ({ role: m.role, content: m.content }))
            })
        });

        if (!response.body) {
            throw new Error("No response body received.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let assistantContent = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            assistantContent += chunk;
            setStreamingAssistantContent(assistantContent);
        }

        // ストリーミング終了後に一度だけ履歴を追加
        // if (progress < maxProgress) {
            const currentHistory = Array.isArray(currentPlayer.get(chatStorage)) ? currentPlayer.get(chatStorage) : [];
            currentPlayer.set(chatStorage, [
                ...currentHistory,
                { role: "assistant", content: assistantContent }
            ]);
            setStreamingAssistantContent("");
        // }
    } catch (error) {
        console.error("Error:", error);
        const errorMessage = "An error occurred. Please check your connection to the server.";
        currentPlayer.set(chatStorage, prevMessages => [...(Array.isArray(prevMessages) ? prevMessages : []), { role: "assistant", content: errorMessage }]);
    }
}