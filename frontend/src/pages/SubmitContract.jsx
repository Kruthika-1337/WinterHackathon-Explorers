import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function SubmitContract() {
  const user = JSON.parse(localStorage.getItem("user"));

  const submit = async () => {
    await addDoc(collection(db, "contracts"), {
      contractorId: user.uid,
      projectName: "Road Work",
      location: "Mangalore",
      status: "pending"
    });

    alert("Contract sent to admin");
  };

  return <button onClick={submit}>Submit Contract</button>;
}

export default SubmitContract;
