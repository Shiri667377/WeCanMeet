import './GroupPage.css'

import { useEffect, useState } from 'react'
import {
    Link,
    useLocation,
    useParams
} from 'react-router-dom'

import {
    FiCalendar,
    FiClock,
    FiCopy,
    FiShare2,
    FiUsers
} from 'react-icons/fi'

import { FaWhatsapp } from 'react-icons/fa'
import confetti from 'canvas-confetti'

function GroupPage() {
    const location = useLocation()
    const { groupId } = useParams()

    const groupCreated = location.state?.groupCreated
    const availabilitySaved =
        location.state?.availabilitySaved

    const participantName =
        location.state?.participantName

    const participantAvailability =
        location.state?.availability

    const group = location.state?.group

    const [copied, setCopied] = useState(false)

    /*
     * Temporary frontend mock.
     *
     * Later the real share link will come from
     * the backend using the group's join code.
     */
    const shareLink =
        `https://wecanmeet.com/group/${groupId}`

    /*
     * Temporary participant count.
     *
     * For now, after saving availability,
     * we treat the current participant as one
     * submitted participant.
     *
     * Later this will come from the backend.
     */
    const participantCount =
        availabilitySaved ? 1 : 0

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(
                shareLink
            )

            setCopied(true)
        } catch {
            setCopied(false)
        }
    }

    function shareToWhatsApp() {
        const message =
            `Join my WeCanMeet group: ${shareLink}`

        const url =
            `https://wa.me/?text=${encodeURIComponent(message)}`

        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        )
    }

    async function shareGroup() {
        if (!navigator.share) {
            return
        }

        try {
            await navigator.share({
                title: 'WeCanMeet',
                text: 'Join my group and add your availability!',
                url: shareLink,
            })
        } catch {
            /*
             * The user may simply close the native
             * share dialog, so no error UI is needed.
             */
        }
    }

    function formatDuration(minutes) {
        if (!minutes) {
            return ''
        }

        if (minutes < 60) {
            return `${minutes} minutes`
        }

        if (minutes % 60 === 0) {
            const hours = minutes / 60

            return hours === 1
                ? '1 hour'
                : `${hours} hours`
        }

        const hours = minutes / 60

        return `${hours} hours`
    }

    useEffect(() => {
        if (groupCreated) {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: {
                    y: 0.6,
                },
            })
        }
    }, [groupCreated])

    return (
        <main className="group-page">
            <section className="group-card">

                {/* Header */}

                <div className="group-header">

                    <p className="eyebrow">
                        {groupCreated
                            ? 'Your group is ready!'
                            : 'Group schedule'}
                    </p>

                    <h1>
                        {group?.name || 'Your group'}
                    </h1>

                    {group?.creatorName && (
                        <p className="group-creator">
                            Created by {group.creatorName}
                        </p>
                    )}

                    <p className="group-description">
                        Share the group with everyone and
                        find the best time to meet.
                    </p>

                </div>

                {/* Group information */}

                <div className="group-details">

                    <div className="detail-item">
                        <span>
                            <FiCalendar />
                            Date range
                        </span>

                        <strong>
                            {group?.startDate &&
                            group?.endDate
                                ? `${group.startDate.toLocaleDateString()} – ${group.endDate.toLocaleDateString()}`
                                : 'Not available'}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>
                            <FiClock />
                            Minimum duration
                        </span>

                        <strong>
                            {group?.meetingDuration
                                ? formatDuration(
                                    group.meetingDuration
                                )
                                : 'Not available'}
                        </strong>
                    </div>

                    <div className="detail-item participant-detail">
                        <span>
                            <FiUsers />
                            Participants
                        </span>

                        <strong>
                            {participantCount}
                        </strong>
                    </div>

                </div>

                {/* Results */}

                <div className="group-results">

                    <div className="section-heading">
                        <div>
                            <h2>
                                Best times
                            </h2>

                            <p>
                                Recommended meeting times will
                                appear here as participants add
                                their availability.
                            </p>
                        </div>
                    </div>

                    <div className="results-empty">
                        <FiCalendar />

                        <strong>
                            No results yet
                        </strong>

                        <p>
                            Once more participants add their
                            availability, the best matching
                            times will appear here.
                        </p>
                    </div>

                </div>

                {/* Availability action */}

                <div className="group-actions">

                    <Link
                        to={`/group/${groupId}/availability`}
                        state={{
                            group,
                            participantName,
                            availability:
                                participantAvailability,
                        }}
                        className="primary-button"
                    >
                        {availabilitySaved
                            ? 'Edit my availability'
                            : 'Add my availability'}
                    </Link>

                </div>

                {/* Share section */}

                <div className="share-section">

                    <label htmlFor="shareLink">
                        Share this group
                    </label>

                    <div className="share-link-row">

                        <input
                            id="shareLink"
                            type="text"
                            value={shareLink}
                            readOnly
                        />

                        <button
                            type="button"
                            className="copy-button"
                            onClick={copyLink}
                        >
                            <FiCopy />

                            {copied
                                ? 'Copied!'
                                : 'Copy'}
                        </button>

                    </div>

                    <div className="share-options">

                        <button
                            type="button"
                            className="share-option"
                            onClick={
                                shareToWhatsApp
                            }
                        >
                            <FaWhatsapp />
                            WhatsApp
                        </button>

                        <button
                            type="button"
                            className="share-option"
                            onClick={shareGroup}
                        >
                            <FiShare2 />
                            Share
                        </button>

                    </div>

                </div>

            </section>
        </main>
    )
}

export default GroupPage