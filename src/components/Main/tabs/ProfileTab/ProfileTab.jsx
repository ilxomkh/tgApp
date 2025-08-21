// tg-app/src/components/Main/tabs/ProfileTab/ProfileTab.jsx
import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BottomSheet from '../../BottomSheet.jsx';
import { SectionCard, GradientCard } from '../../ui';

import ProfileHeader from './parts/ProfileHeader.jsx';
import RowButton from './parts/RowButton.jsx';
import LabeledInput from './parts/LabeledInput.jsx';
import BlueCard from './parts/BlueCard.jsx';
import ActionButton from './parts/ActionButton.jsx';
import Toast from './parts/Toast.jsx';
import LanguageSwitcher from './parts/LanguageSwitcher.jsx';

/**
 * Ожидаемые ключи в t (uz/ru в LanguageContext):
 * user, phoneNA, personalData, projectInfo, publicOffer, changeLang, support, orderSurvey,
 * save, saved, fillRequired, requestSent, choose, name, enterName, phone, birthdate, email,
 * fullname, orgName, orgPosition, supportHint, openTelegram, projectInfoLong, publicOfferLong,
 * changeLangNote, sendRequest, supportTelegramUrl
 */

const ProfileTab = ({ t = {} }) => {
  const { user } = useAuth();
  const { language, openLanguageModal } = useLanguage();

  // ---------------- Toast
  const [toast, setToast] = React.useState(null);
  const showToast = (m) => {
    if (!m) return;
    setToast(m);
    clearTimeout(showToast.__t);
    showToast.__t = setTimeout(() => setToast(null), 2000);
  };

  // ---------------- Sheets
  const [personalSheet, setPersonalSheet] = React.useState(false);
  const [infoSheet, setInfoSheet] = React.useState(false);
  const [offerSheet, setOfferSheet] = React.useState(false);
  const [langSheet, setLangSheet] = React.useState(false);
  const [supportSheet, setSupportSheet] = React.useState(false);
  const [orderSheet, setOrderSheet] = React.useState(false);

  // ---------------- Form states
  const [personal, setPersonal] = React.useState({
    name: user?.name || '',
    phone: user?.phoneNumber || '',
    birthdate: user?.birthdate || '',
    email: user?.email || '',
  });

  const [order, setOrder] = React.useState({
    fio: user?.name || '',
    org: '',
    position: '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
  });

  // ---------------- Actions
  const savePersonal = async () => {
    // TODO: отправка на API
    setPersonalSheet(false);
    showToast(t.saved);
  };

  const submitOrder = async () => {
    if (!order.fio?.trim() || !order.phone?.trim()) {
      return showToast(t.fillRequired);
    }
    // TODO: отправка на API
    setOrderSheet(false);
    showToast(t.requestSent);
  };

  return (
    <div className="space-y-6 pb-2">
      {/* Профильная карточка */}
      <GradientCard className="text-center py-8 relative overflow-hidden">
        <ProfileHeader
          title={user?.name || t.user}
          subtitle={user?.phoneNumber || t.phoneNA}
        />
      </GradientCard>

      {/* Меню действий */}
      <SectionCard className="p-4 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <div className="space-y-2">
          <RowButton
            onClick={() => setPersonalSheet(true)}
            label={t.personalData}
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
          <RowButton
            onClick={() => setInfoSheet(true)}
            label={t.projectInfo}
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            }
          />
          <RowButton
            onClick={() => setOfferSheet(true)}
            label={t.publicOffer}
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
            }
          />
          <RowButton
            onClick={() => setLangSheet(true)}
            label={t.changeLang}
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
          />
          <RowButton
            onClick={() => setSupportSheet(true)}
            label={t.support}
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            }
          />
          <RowButton
            onClick={() => setOrderSheet(true)}
            label={t.orderSurvey}
            isLast
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
            }
          />
        </div>
      </SectionCard>

      {/* Toast */}
      <Toast open={!!toast}>{toast}</Toast>

      {/* ---------- Bottom Sheets ---------- */}

      {/* Личные данные */}
      <BottomSheet
        title={t.personalData}
        open={personalSheet}
        onClose={() => setPersonalSheet(false)}
        bodyClassName="space-y-4 pb-6"
        footer={
          <ActionButton onClick={savePersonal}>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              {t.save}
            </div>
          </ActionButton>
        }
      >
        <div className="space-y-4">
          <LabeledInput
            label={t.name}
            value={personal.name}
            onChange={(v) => setPersonal((s) => ({ ...s, name: v }))}
            placeholder={t.enterName}
          />
          <LabeledInput
            label={t.phone}
            value={personal.phone}
            onChange={(v) => setPersonal((s) => ({ ...s, phone: v }))}
            inputMode="tel"
            placeholder={t.phone}
          />
          <LabeledInput
            label={t.birthdate}
            value={personal.birthdate}
            onChange={(v) => setPersonal((s) => ({ ...s, birthdate: v }))}
            type="date"
          />
          <LabeledInput
            label={t.email}
            value={personal.email}
            onChange={(v) => setPersonal((s) => ({ ...s, email: v }))}
            type="email"
            placeholder={t.email}
          />
        </div>
      </BottomSheet>

      {/* Информация о проекте */}
      <BottomSheet
        title={t.projectInfo}
        open={infoSheet}
        onClose={() => setInfoSheet(false)}
        bodyClassName="pb-6"
      >
        <div className="space-y-4">
          <BlueCard title={t.projectInfo}>
            {t.projectInfoLong}
          </BlueCard>
        </div>
      </BottomSheet>

      {/* Публичная оферта */}
      <BottomSheet
        title={t.publicOffer}
        open={offerSheet}
        onClose={() => setOfferSheet(false)}
        bodyClassName="pb-6"
      >
        <div className="space-y-4">
          <BlueCard title={t.publicOffer}>
            {t.publicOfferLong}
          </BlueCard>
        </div>
      </BottomSheet>

      {/* Выбор языка */}
      <BottomSheet
        title={t.changeLang}
        open={langSheet}
        onClose={() => setLangSheet(false)}
        bodyClassName="pb-6"
      >
        <LanguageSwitcher onClose={() => setLangSheet(false)} />
      </BottomSheet>

      {/* Поддержка */}
      <BottomSheet
        title={t.support}
        open={supportSheet}
        onClose={() => setSupportSheet(false)}
        bodyClassName="space-y-6 pb-6"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.04 15.51l-.38 5.34c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.93-.9l3.49-16.37h.01c.31-1.45-.52-2.02-1.46-1.67L1.24 10.1c-1.41.55-1.39 1.35-.24 1.7l5.32 1.66L19.6 6.88c.73-.48 1.4-.22.85.26" />
              </svg>
            </div>
            <p className="text-gray-700 leading-relaxed">{t.supportHint}</p>
          </div>

          <ActionButton
            variant="blue"
            onClick={() => window.open(t.supportTelegramUrl || 'https://t.me/', '_blank')}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.04 15.51l-.38 5.34c.54 0 .78-.23 1.06-.5l2.55-2.43 5.29 3.87c.97.53 1.66.25 1.93-.9l3.49-16.37h.01c.31-1.45-.52-2.02-1.46-1.67L1.24 10.1c-1.41.55-1.39 1.35-.24 1.7l5.32 1.66L19.6 6.88c.73-.48 1.4-.22.85.26" />
              </svg>
              {t.openTelegram}
            </div>
          </ActionButton>
        </div>
      </BottomSheet>

      {/* Заказать опрос */}
      <BottomSheet
        title={t.orderSurvey}
        open={orderSheet}
        onClose={() => setOrderSheet(false)}
        bodyClassName="space-y-4 pb-6"
        footer={
          <ActionButton onClick={submitOrder}>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9 22,2" />
              </svg>
              {t.sendRequest}
            </div>
          </ActionButton>
        }
      >
        <div className="space-y-4">
          <LabeledInput
            label={t.fullname}
            value={order.fio}
            onChange={(v) => setOrder((s) => ({ ...s, fio: v }))}
            placeholder={t.enterName}
            required
          />
          <LabeledInput
            label={t.orgName}
            value={order.org}
            onChange={(v) => setOrder((s) => ({ ...s, org: v }))}
            placeholder={t.orgName}
          />
          <LabeledInput
            label={t.orgPosition}
            value={order.position}
            onChange={(v) => setOrder((s) => ({ ...s, position: v }))}
            placeholder={t.orgPosition}
          />
          <LabeledInput
            label={t.phone}
            value={order.phone}
            onChange={(v) => setOrder((s) => ({ ...s, phone: v }))}
            inputMode="tel"
            placeholder={t.phone}
            required
          />
          <LabeledInput
            label={t.email}
            value={order.email}
            onChange={(v) => setOrder((s) => ({ ...s, email: v }))}
            type="email"
            placeholder={t.email}
          />
        </div>
      </BottomSheet>
    </div>
  );
};

export default ProfileTab;
