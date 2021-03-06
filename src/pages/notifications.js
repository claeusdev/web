import { usePageLayout } from '../components/App/PageLayout'
import Notification from '../components/App/Notification'
import { useTitle } from '../hooks/meta'
import withAuth from '../middleware/auth'
import { useState, useMemo } from 'react'
import { ZERO_TAGLINES } from '@/utils/constants'
import { random } from '@/utils/arr'
import useNotifications from '@/hooks/notifications'
import Tabs from '@/components/App/Tabs'
import Swipe from 'react-easy-swipe'

const Notifications = () => {
	const setTitle = useTitle('Notifications')
	const { notifications } = useNotifications()
	const [showRead, setShowRead] = useState(false)
	const [swipeDirection, setSwipeDirection] = useState(null)
	const filteredNotifications = notifications?.filter((notification) => showRead || notification.unread)
	const zeroTagline = useMemo(() => random(ZERO_TAGLINES), [ZERO_TAGLINES])

	const registerDirection = (position) => {
		if (Math.abs(position.x) < 50) return

		setSwipeDirection(position.x > 0 ? 'right' : 'left')
	}

	const performSwipe = () => {
		if (swipeDirection === 'left' && !showRead) setShowRead(true)
		if (swipeDirection === 'right' && showRead) setShowRead(false)

		setSwipeDirection(null)
	}

	return (
		<>
			{setTitle}
			<Swipe onSwipeMove={registerDirection} onSwipeEnd={performSwipe} tagName="div" className="max-w-md sm:max-w-3xl relative z-0 sm:mt-4 h-full">
				<div className="flex flex-col sm:rounded-lg sm:bg-white sm:dark:bg-gray-900 sm:shadow">
					<div>
						<div className="border-b border-gray-200 dark:border-gray-800">
							<nav className="flex -mb-px ml-4">
								<Tabs
									tabs={[
										{
											tag: 'button',
											active: !showRead,
											onClick: () => setShowRead(false),
											content: (
												<>
													{notifications && <div className="mr-2 px-1.5 h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600">{notifications.filter((notification) => notification.unread).length}</div>}
													<span>Unread</span>
												</>
											),
										},
										{
											tag: 'button',
											active: showRead,
											onClick: () => setShowRead(true),
											content: <span>All</span>,
										},
									]}
								/>
							</nav>
						</div>
					</div>
					{notifications ? filteredNotifications.map((notification, key) => <Notification key={key} {...notification} />) : [...Array(10).keys()].map((key) => <Notification key={key} />)}
					{notifications && filteredNotifications.length === 0 && (
						<div className="text-center mt-10 pb-6">
							<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" className="mx-auto animation-ring mb-4">
								<path className="text-indigo-400 fill-current" d="M86 79c.57.76 1.24 1.43 2 2H12a9.97 9.97 0 0 0 4-8V42a34 34 0 1 1 68 0v31c0 1.83.49 3.53 1.34 5l.66 1z" />
								<path className="text-indigo-500 fill-current" d="M6 83h92v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3h4z" />
								<path className="text-indigo-300 fill-current" d="M46 6.22a36.4 36.4 0 0 1 8 0V6a4 4 0 1 0-8 .22z" />
								<path className="text-indigo-500 fill-current" d="M43 91a7 7 0 1 0 14 0H43z" />
								<path className="text-indigo-800 fill-current" d="M55.75 95h-11.5A6.97 6.97 0 0 1 43 91h14c0 1.49-.46 2.87-1.25 4z" />
								<path className="text-indigo-900 fill-current" fillRule="nonzero" d="M44.02 6.5a6 6 0 1 1 11.96 0A36 36 0 0 1 86 42v31a8 8 0 0 0 8 8h6v5a5 5 0 0 1-5 5H59a9 9 0 1 1-18 0H5a5 5 0 0 1-5-5v-5h6a8 8 0 0 0 8-8V42A36 36 0 0 1 44.02 6.5zM86 79H57v-1h28.34A9.93 9.93 0 0 1 84 73V42a34 34 0 1 0-68 0v31a9.97 9.97 0 0 1-4 8h76a10.06 10.06 0 0 1-2-2zM6 83H2v3a3 3 0 0 0 3 3h90a3 3 0 0 0 3-3v-3H6zM46 6.22a36.4 36.4 0 0 1 8 0V6a4 4 0 1 0-8 .22zM43 91a7 7 0 1 0 14 0H43zm7-77v1a27 27 0 0 0-23.83 14.3l-.88-.48A28 28 0 0 1 50 14zM22.94 34.78c.29-1.09.64-2.15 1.06-3.18l.92.37c-.4 1-.74 2.02-1.01 3.07l-.97-.26zm-.7 3.52l1 .13A27.25 27.25 0 0 0 23 42v12h-1V42c0-1.25.08-2.49.24-3.7z" />
							</svg>
							<p className="text-4xl text-gray-800 dark:text-gray-300">No new notifications</p>
							<p className="text-2xl text-gray-700 dark:text-gray-400">{zeroTagline}</p>
						</div>
					)}
				</div>
			</Swipe>
		</>
	)
}

Notifications.middleware = withAuth()
Notifications.getLayout = usePageLayout('Notifications')

export default Notifications
