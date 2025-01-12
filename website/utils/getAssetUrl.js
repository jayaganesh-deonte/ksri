export default function (url) {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
}
