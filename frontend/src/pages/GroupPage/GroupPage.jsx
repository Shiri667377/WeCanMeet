import './GroupPage.css'
import { FiCopy, FiShare2 } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import confetti from 'canvas-confetti'

function GroupPage() {
    const [copied, setCopied] = useState(false)
    const shareLink = 'https://wecanmeet.com/group/ABC123'

    async function copyLink() {
        await navigator.clipboard.writeText(shareLink)
        setCopied(true)
    }

    function shareToWhatsApp() {
        const message = `Join my WeCanMeet group: ${shareLink}`
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`

        window.open(url, '_blank')
    }

    async function shareGroup() {
        if (navigator.share) {
            await navigator.share({
                title: 'WeCanMeet',
                text: 'Join my group and add your availability!',
                url: shareLink,
            })
        }
    }

    const location = useLocation()
    const groupCreated = location.state?.groupCreated

    useEffect(() => {
        if (groupCreated) {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
            })
        }
    }, [groupCreated])

    return (
        <main className="group-page">
            <section className="group-card">
                <div className="group-header">
                    <p className="eyebrow">Your group is ready!</p>
                    <h1>Study Group</h1>

                    <p className="group-description">
                        Share the link with everyone, then add your own availability.
                    </p>
                </div>

                <div className="group-details">
                    <div className="detail-item">
                        <span>Date range</span>
                        <strong>10 Sep – 18 Sep</strong>
                    </div>

                    <div className="detail-item">
                        <span>Meeting duration</span>
                        <strong>1 hour</strong>
                    </div>
                </div>

                <div className="share-section">
                    <label htmlFor="shareLink">Share this group</label>

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
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className="share-options">
                        <button
                            type="button"
                            className="share-option"
                            onClick={shareToWhatsApp}
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