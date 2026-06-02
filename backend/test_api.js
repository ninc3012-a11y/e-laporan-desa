async function test() {
  try {
    const res = await fetch('https://backend-laporan-desa.vercel.app/api/informasi');
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
test();
