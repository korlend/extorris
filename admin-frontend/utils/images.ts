export async function srcToFile(
  src: string,
  fileName: string,
  mimeType: string
) {
  const result = await fetch(src);
  const arrayBuffer = await result.arrayBuffer();
  return await new File([arrayBuffer], fileName, { type: mimeType });
}
