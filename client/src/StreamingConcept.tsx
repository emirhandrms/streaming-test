import { useEffect, useState } from "react";

const StreamingComponent = () => {
  const [textReaded, setTextReaded] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/stream")
      .then((response) => {
        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const processText = ({
          done,
          value,
        }: ReadableStreamReadResult<Uint8Array>): Promise<void> | undefined => {
          if (done) {
            console.log("Stream closed.");
            return;
          }

          if (value) {
            // Gelen chunk'ı decode et ve JSON parse işlemi ile mesajı ayıkla
            const chunk = decoder.decode(value);
            const messages = chunk
              .trim()
              .split("\n\n")
              .map((line) => {
                if (line.startsWith("data: ")) {
                  const data = line.replace("data: ", "").trim();
                  try {
                    return JSON.parse(data).message;
                  } catch {
                    return null;
                  }
                }
                return null;
              })
              .filter(Boolean);

            // Gelen mesajları birleştirip önceki metne boşluklu olarak ekleyin
            setTextReaded((prev) => prev + " " + messages.join(" "));
            console.log("Received:", messages.join(" "));
          }

          return reader.read().then(processText);
        };

        reader.read().then(processText);
      })
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        marginTop: "50px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "black",
          fontSize: "30px",
        }}
      >
        Streaming Fake Data from Server...
      </h1>
      <br />
      <div
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          width: "500px",
          height: "500px",
          padding: "10px",
          border: "1px solid black",
          borderRadius: "5px",
          overflowY: "scroll",
          margin: "auto",
          marginTop: "30px",
        }}
      >
        {textReaded}
      </div>
    </div>
  );
};

export default StreamingComponent;
