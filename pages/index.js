
export default function Home({currentVersion, updateAvailable}) {
  return (
    <div >
      The current version is {currentVersion}
      {updateAvailable && <div>UPDATE AVAILABLE!!!</div>}
    </div>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://www.ivium.com/support/#Software%20update')
  const body = await res.text()

  // console.log({body})
  const versionIndex = body.indexOf("<strong>")
  const versionOffset = "<strong>".length;
  const currentVersion = body.slice(versionIndex + versionOffset, versionIndex + versionOffset + 16);

  const updateAvailable = currentVersion !== process.env.PYVIUM_IVIUMSOFT_VERSION

  if (updateAvailable) {

  }

  return {
    props: {
      currentVersion,
      updateAvailable
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60 * 60 * 24, // In seconds
  }
}
