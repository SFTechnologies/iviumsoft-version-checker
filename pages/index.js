
export default function Home({currentVersion, pyviumVersion, updateAvailable}) {
  const env = process.env.NODE_ENV
  console.log(env)
  return (
    <div >
      The current version is {currentVersion} <br />
      Pyvium uses the DLL from {pyviumVersion}
      {updateAvailable && <> &rarr; UPDATE AVAILABLE!!!</>}
    </div>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://www.ivium.com/support/#Software%20update')
  const body = await res.text()

  const versionIndex = body.indexOf("<strong>")
  const versionOffset = "<strong>".length;
  const currentVersion = body.slice(versionIndex + versionOffset, versionIndex + versionOffset + 16);
  const pyviumVersion = process.env.PYVIUM_IVIUMSOFT_VERSION
  const isProduction = process.env.NODE_ENV === 'production'
  const updateAvailable = currentVersion !== pyviumVersion


  if (updateAvailable && isProduction) {
    const text = `✨ New IviumSoft version ✨\nRelease: ${currentVersion} \nActual version: ${process.env.PYVIUM_IVIUMSOFT_VERSION}`
    await fetch(process.env.VERSION_ALERT_SLACK_WEBHOOK_URL, {
      body: JSON.stringify({text}),
      method: "POST"
    })
  }

  return {
    props: {
      currentVersion,
      pyviumVersion,
      updateAvailable
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60 * 60 * 24, // In seconds
  }
}
