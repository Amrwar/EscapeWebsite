export default function notFound(site) {
  return {
    file: '404.html',
    title: `Page not found — ${site.name}`,
    description: 'That page has moved or never existed. Here is the way back.',
    body: `
<section class="page-header tall">
  <p class="eyebrow center">404</p>
  <h1>That page took <em>a walk</em></h1>
  <p>The link is broken or the page has moved. The chair is still here, though.</p>
  <div class="hero-actions center" style="margin-top:2rem">
    <a href="index.html" class="btn btn-primary">Back to Home</a>
    <a href="book.html" class="btn btn-ghost">Book an Appointment</a>
  </div>
</section>
`,
  };
}
