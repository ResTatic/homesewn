import { isValidRequest } from '@sanity/webhook'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: Omit<NextApiRequest, 'body'> & { body: { slug: string } },
  res: NextApiResponse<string>
) {
  if (req.method !== 'POST') {
    return res.status(401).send('Invalid method')
  }

  if (
    !process.env.SANITY_WEBHOOK_SECRET ||
    !isValidRequest(req, process.env.SANITY_WEBHOOK_SECRET)
  ) {
    return res.status(401).send('Invalid signature')
  }

  if (!('slug' in req.body && typeof req.body.slug === 'string')) {
    return res.status(401).send('Invalid payload')
  }

  const { slug } = req.body
  try {
    await Promise.all([res.unstable_revalidate('/'), res.unstable_revalidate(`/artikel/${slug}`)])
    return res.send(`${slug} and home revalidated successfully`)
  } catch (error) {
    return res.status(500).send(`Error revalidating: ${(error as Error).message}`)
  }
}
