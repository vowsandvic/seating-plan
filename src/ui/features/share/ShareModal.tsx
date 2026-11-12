import { useState } from 'react';
import { usePlan } from '../../state/PlanProvider';
import { useT } from '../../i18n/I18nContext';
import { useToast } from '../../components/Toast';
import { ModalBackdrop, ModalCloseButton } from '../../components/Modal';
import { QrCode, downloadQrPng } from '../../components/QrCode';
import { DownloadIcon } from '../../components/Icons';
import { DISPLAY_SITE_URL, EVENT_PATH_MAX, displayUrlFor, finalizeEventPath, normalizeEventPathInput } from '../../../domain/eventPath';

/** Sets the event path seating-display is published under and shows the matching guest
 * link + QR code. The path is saved locally and travels in the exported data.json. */
export function ShareModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = usePlan();
  const { t } = useT();
  const { showToast } = useToast();
  const [draft, setDraft] = useState(state.eventPath);

  const finalPath = finalizeEventPath(draft);
  const url = displayUrlFor(finalPath);

  function commit() {
    setDraft(finalPath);
    if (finalPath !== state.eventPath) dispatch({ type: 'SET_EVENT_PATH', eventPath: finalPath });
  }

  function close() {
    commit();
    onClose();
  }

  async function copyLink() {
    commit();
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('shareToastCopied'));
    } catch {
      window.prompt(t('shareLinkLabel'), url);
    }
  }

  function downloadQr() {
    commit();
    downloadQrPng(url, `seating-display-qr${finalPath ? `-${finalPath}` : ''}.png`);
  }

  return (
    <ModalBackdrop onClose={close}>
      <div className="modal share-modal">
        <ModalCloseButton onClose={close} label={t('modalCloseLabel')} />
        <h3>{t('shareModalTitle')}</h3>
        <div className="cap">{t('shareModalSubtitle')}</div>

        <label className="share-label" htmlFor="event-path">{t('sharePathLabel')}</label>
        <div className="share-path-row">
          <span className="share-path-prefix">{DISPLAY_SITE_URL.replace(/^https:\/\//, '')}</span>
          <input
            id="event-path"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            maxLength={EVENT_PATH_MAX}
            placeholder={t('sharePathPlaceholder')}
            value={draft}
            onChange={(e) => setDraft(normalizeEventPathInput(e.target.value))}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
          />
        </div>
        <div className="hint share-hint">{finalPath ? t('sharePathHint') : t('sharePathEmptyHint')}</div>

        <div className="share-qr">
          <QrCode text={url} size={196} label={t('shareQrAlt')} />
          <a className="share-url" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </div>

        <div className="share-actions">
          <button type="button" className="chip" onClick={copyLink}>{t('shareCopyLink')}</button>
          <button type="button" className="chip primary" onClick={downloadQr}><DownloadIcon size={15} />{t('shareDownloadQr')}</button>
        </div>
        <div className="hint share-hint">{t('shareDeployHint')}</div>
      </div>
    </ModalBackdrop>
  );
}
