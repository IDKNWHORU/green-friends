"use client";

import { PredictionAPIClient } from "@azure/cognitiveservices-customvision-prediction";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import Image from "next/image";
import { useRef, useState } from "react";

export default function () {
  const [result, setResult] = useState("");
  const [pending, setPending] = useState(false);
  const fileRef = useRef();
  const [selectedImage, setSelectedImage] = useState("");

  const items = {
    glass: "이건 유리야!🔍\n유리병은 깨질 수 있으니 던지지 말고 조심히 버려줘!",
    metal: "이건 금속이야!🔧\n날카로운 모서리에 손이 베이지 않게 조심해!",
    plastic: "이건 플라스틱이야!🌱\n페트병은 라벨을 떼고 찌그러트려 버려줘!",
    trash: "이건 일반쓰레기야!🗑️\n일반쓰레기는 종량제 봉투에 모아줄래?",
    paper: "이건 종이야!📄\n종이는 종이끼리 모여진 데 버려주면 돼!",
  };

  const haldeFileChange = (evt) => {
    setPending(true);
    const selectedFile = evt.target.files[0];

    const reader = new FileReader();

    reader.onloadend = async (loadEvt) => {
      const predictionKey = process.env.NEXT_PUBLIC_PREDICTION_KEY;
      const predictionEndpoint = process.env.NEXT_PUBLIC_PREDICTION_END_POINT;
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
      const modelName = process.env.NEXT_PUBLIC_MODEL_NAME;

      let info =
        "무슨 쓰레기인지 잘 모르겠어.\n주위를 정리하고 사진을 다시 찍어줄래?";

      try {
        const credentials = new ApiKeyCredentials({
          inHeader: { "Prediction-key": predictionKey },
        });

        const predictor = new PredictionAPIClient(
          credentials,
          predictionEndpoint
        );

        const { predictions } = await predictor.classifyImage(
          projectId,
          modelName,
          selectedFile
        );

        for (let prediction of predictions) {
          if (prediction.probability * 100 > 70) {
            info = items[prediction.tagName];
            break;
          }
        }

        setTimeout(() => {
          setSelectedImage(loadEvt.target.result);
          setResult(info);
          setPending(false);
        }, 3000);
      } catch (error) {
        setPending(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleClickBox = () => {
    fileRef.current.click();
  };

  const handleRetry = () => {
    setPending(false);
    setResult("");
    setSelectedImage("");
  };

  return (
    <article className="bg">
      {pending ? (
        <div className="loading">
          <div className="loading-message">
            <span>쓰</span>
            <span>레</span>
            <span>기</span>
            <span>를</span>
            <span> 요</span>
            <span>리</span>
            <span>조</span>
            <span>리</span>
            <span> 살</span>
            <span>펴</span>
            <span>보</span>
            <span>는</span>
            <span> 중</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
          <Image
            src="/char2.png"
            alt="loading.."
            width={140}
            height={140}
          ></Image>
        </div>
      ) : result === "" ? (
        <>
          <section className="content">
            <h1 className="operate">버리려는 쓰레기를 찍어봐!</h1>
            <div className="box" onClick={handleClickBox}>
              <Image
                className="cam"
                src="/cam.png"
                alt="cam"
                width={140}
                height={140}
              />
            </div>
            <form action="" className="hidden">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={haldeFileChange}
              />
            </form>
          </section>
          <footer className="footer">
            <h2 className="description">"한 번에 하나의 쓰레기만 찍어야 해"</h2>
            <section className="char1">
              <Image src="/char1.png" alt="char1" width={150} height={150} />
            </section>
          </footer>
        </>
      ) : (
        <>
          <section className="result">
            <div className="header1">
              <div className="box2">
                <Image src={selectedImage} fill={true} alt="선택된 이미지" />
              </div>
            </div>
            <form className="body1" action="">
              <textarea
                className="message"
                defaultValue={result}
                placeholder="무슨 쓰레기인지 잘 모르겠어. 주위를 정리하고 사진을 다시 찍어줄래?"
                readOnly
              />
            </form>
            <div className="footer1">
              <button className="retry" type="button" onClick={handleRetry}>
                다시 찍어보기
              </button>
            </div>
          </section>
        </>
      )}
    </article>
  );
}
