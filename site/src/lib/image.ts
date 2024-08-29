import { getImage } from "astro:assets";
import type { ImageFunction, z } from "astro:content";

/**
 * Downsizes an image by using getImage, returning its src attribute.
 * Useful in specific cases where we want the image to determine
 * its own width/height or scale preserving its aspect ratio,
 * which <Image /> does not allow.
 */
export async function getDownsizedSrc(
  image: z.infer<ReturnType<ImageFunction>>,
  width: number
) {
  const result = await getImage({
    src: image,
    // Use getImage's srcSet functionality to downsize
    widths: [width],
  });
  // Pull downsized image URL out of returned srcSet
  return result.srcSet.attribute.split(" ")[0];
}
