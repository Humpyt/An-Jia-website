// This file is used to configure the analytics page
// It disables static generation for the analytics page

export const config = {
  unstable_runtimeJS: true,
  unstable_JsPreload: true,
  runtime: 'nodejs',
  preferredRegion: 'auto',
  dynamic: 'force-dynamic',
  dynamicParams: true,
  revalidate: 0,
}
