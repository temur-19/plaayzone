import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getLocations,
  createBookingRequest,
  loadApiUrl,
  login,
  normalizeApiUrl,
  saveApiUrl,
} from "./src/api";

const CATEGORIES = [
  { value: "", label: "Barchasi" },
  { value: "stadium", label: "Mini-stadion" },
  { value: "playstation", label: "Playstation" },
  { value: "pc_club", label: "Kompyuter klub" },
  { value: "billiard", label: "Billiard" },
];

export default function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [urlDraft, setUrlDraft] = useState("");
  const [configReady, setConfigReady] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [configError, setConfigError] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);
  const [category, setCategory] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    let active = true;
    loadApiUrl()
      .then((url) => {
        if (active) {
          setApiBaseUrl(url);
          setUrlDraft(url);
          setLoading(Boolean(url));
        }
      })
      .catch((error) => {
        if (active) setConfigError(error.message);
      })
      .finally(() => {
        if (active) setConfigReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!configReady || !apiBaseUrl) return undefined;

    let active = true;

    getLocations(category)
      .then((data) => {
        if (active) {
          setLocations(data);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiBaseUrl, category, configReady, reloadKey]);

  async function handleSaveApiUrl() {
    setConfigError("");
    setSavingConfig(true);
    try {
      const normalizedUrl = normalizeApiUrl(urlDraft);
      await saveApiUrl(normalizedUrl);
      setApiBaseUrl(normalizedUrl);
      setUrlDraft(normalizedUrl);
      setLoading(true);
      setLoadError("");
      setConfigOpen(false);
    } catch (error) {
      setConfigError(error.message);
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleLogin() {
    setLoginError("");
    setLoggingIn(true);
    try {
      const session = await login(username.trim(), password);
      setUser(session.user);
      setPassword("");
      setLoginOpen(false);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleBookingSubmit(booking) {
    setBookingError("");
    setBookingStatus("");
    setBookingSubmitting(true);
    try {
      await createBookingRequest({
        location_id: selectedLocation.id,
        ...booking,
      });
      setBookingStatus("So‘rovingiz yuborildi. Maskan egasining tasdig‘ini kuting.");
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setBookingSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          key={selectedLocation ? `location-${selectedLocation.id}` : "locations"}
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>P</Text>
              </View>
              <Text style={styles.brandName}>PlayZone</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setUrlDraft(apiBaseUrl);
                  setConfigError("");
                  setConfigOpen((open) => !open);
                  setLoginOpen(false);
                }}
                style={styles.accountButton}
              >
                <Text style={styles.accountButtonText}>Server</Text>
              </Pressable>
              {user ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setUser(null)}
                  style={styles.accountButton}
                >
                  <Text style={styles.accountButtonText}>Chiqish</Text>
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setLoginOpen((open) => !open);
                    setConfigOpen(false);
                    setLoginError("");
                  }}
                  style={styles.accountButton}
                >
                  <Text style={styles.accountButtonText}>Kirish</Text>
                </Pressable>
              )}
            </View>
          </View>

          {selectedLocation ? (
            <LocationDetails
              apiBaseUrl={apiBaseUrl}
              bookingError={bookingError}
              bookingStatus={bookingStatus}
              isSubmitting={bookingSubmitting}
              location={selectedLocation}
              onBack={() => {
                setSelectedLocation(null);
                setBookingError("");
                setBookingStatus("");
              }}
              onSubmit={handleBookingSubmit}
            />
          ) : (
            <>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>PLAYZONE • O‘YIN VA DAM OLISH</Text>
            <Text style={styles.title}>O‘zingizga mos{"\n"}maskanni toping</Text>
            <Text style={styles.subtitle}>
              Shahringizdagi o‘yin maskanlarini bir joyda kashf qiling.
            </Text>
          </View>

          {configOpen && (
            <View style={styles.loginCard}>
              <Text style={styles.sectionTitle}>Backend server manzili</Text>
              <Text style={styles.noticeText}>
                Cloudflare manzili o‘zgarsa, yangisini shu yerga kiriting.
                Manzil telefonda saqlanadi.
              </Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                onChangeText={setUrlDraft}
                onSubmitEditing={handleSaveApiUrl}
                placeholder="https://example.trycloudflare.com"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
                value={urlDraft}
              />
              {!!configError && <Text style={styles.errorText}>{configError}</Text>}
              <Pressable
                accessibilityRole="button"
                disabled={savingConfig}
                onPress={handleSaveApiUrl}
                style={[styles.primaryButton, savingConfig && styles.disabledButton]}
              >
                {savingConfig ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Manzilni saqlash</Text>
                )}
              </Pressable>
            </View>
          )}

          {loginOpen && !user && (
            <View style={styles.loginCard}>
              <Text style={styles.sectionTitle}>Hisobingizga kiring</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
                placeholder="Foydalanuvchi nomi"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
                value={username}
              />
              <TextInput
                onChangeText={setPassword}
                onSubmitEditing={handleLogin}
                placeholder="Parol"
                placeholderTextColor={COLORS.muted}
                secureTextEntry
                style={styles.input}
                value={password}
              />
              {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}
              <Pressable
                accessibilityRole="button"
                disabled={loggingIn || !username.trim() || !password}
                onPress={handleLogin}
                style={[
                  styles.primaryButton,
                  (loggingIn || !username.trim() || !password) && styles.disabledButton,
                ]}
              >
                {loggingIn ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Kirish</Text>
                )}
              </Pressable>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>O‘yin maskanlari</Text>
              <Text style={styles.sectionCaption}>
                {loading ? "Yuklanmoqda..." : `${locations.length} ta maskan`}
              </Text>
            </View>
            {loading && <ActivityIndicator color={COLORS.green} />}
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.categoryList}
            showsHorizontalScrollIndicator={false}
          >
            {CATEGORIES.map((item) => {
              const selected = category === item.value;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={item.value || "all"}
                  onPress={() => {
                    if (category === item.value) return;
                    setLoading(true);
                    setLoadError("");
                    setCategory(item.value);
                  }}
                  style={[styles.categoryChip, selected && styles.selectedCategoryChip]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.selectedCategoryText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {!configReady ? (
            <View style={styles.noticeCard}>
              <ActivityIndicator color={COLORS.green} />
            </View>
          ) : !apiBaseUrl ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Backend manzili sozlanmagan</Text>
              <Text style={styles.noticeText}>
                Server tugmasini bosib, backend manzilini kiriting.
              </Text>
              {!!configError && <Text style={styles.errorText}>{configError}</Text>}
            </View>
          ) : loadError ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Ma’lumotlarni yuklab bo‘lmadi</Text>
              <Text style={styles.noticeText}>{loadError}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setLoading(true);
                  setReloadKey((key) => key + 1);
                }}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Qayta urinish</Text>
              </Pressable>
            </View>
          ) : !loading && locations.length === 0 ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Hozircha maskan topilmadi</Text>
              <Text style={styles.noticeText}>
                Boshqa toifani tanlang yoki keyinroq qayta urinib ko‘ring.
              </Text>
            </View>
          ) : (
            <View style={styles.locationList}>
              {locations.map((location) => (
                <Pressable
                  accessibilityLabel={`${location.name} tafsilotlari`}
                  accessibilityRole="button"
                  key={location.id}
                  onPress={() => {
                    setSelectedLocation(location);
                    setBookingError("");
                    setBookingStatus("");
                  }}
                >
                  <LocationCard apiBaseUrl={apiBaseUrl} location={location} />
                </Pressable>
              ))}
            </View>
          )}
          <Text style={styles.footer}>PlayZone — hordiq uchun to‘g‘ri tanlov</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LocationDetails({
  apiBaseUrl,
  bookingError,
  bookingStatus,
  isSubmitting,
  location,
  onBack,
  onSubmit,
}) {
  const initialTime = new Date();
  initialTime.setHours(initialTime.getHours() + 1, 0, 0, 0);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestedDate, setRequestedDate] = useState(
    formatDateInput(initialTime),
  );
  const [requestedTime, setRequestedTime] = useState(
    `${String(initialTime.getHours()).padStart(2, "0")}:00`,
  );
  const [durationHours, setDurationHours] = useState("1");
  const [formError, setFormError] = useState("");
  const imageUri = location.image
    ? location.image.startsWith("http")
      ? location.image
      : `${apiBaseUrl}${location.image.startsWith("/") ? "" : "/"}${location.image}`
    : null;

  function submit() {
    setFormError("");
    const requestedAt = new Date(`${requestedDate}T${requestedTime}:00`);
    const [year, month, day] = requestedDate.split("-").map(Number);
    const duration = Number(durationHours);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ||
      !/^\d{2}:\d{2}$/.test(requestedTime) ||
      Number.isNaN(requestedAt.getTime()) ||
      requestedAt.getFullYear() !== year ||
      requestedAt.getMonth() + 1 !== month ||
      requestedAt.getDate() !== day ||
      requestedAt <= new Date()
    ) {
      setFormError("Kelajakdagi to‘g‘ri sana va vaqtni kiriting.");
      return;
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 24) {
      setFormError("Davomiylik 1 dan 24 soatgacha bo‘lishi kerak.");
      return;
    }

    return onSubmit({
      customer_name: customerName.trim(),
      phone_number: phoneNumber,
      requested_at: requestedAt.toISOString(),
      duration_hours: duration,
    });
  }

  return (
    <View>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Text style={styles.retryButtonText}>‹  Maskanlar ro‘yxatiga qaytish</Text>
      </Pressable>
      <View style={styles.detailCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.detailImage} />
        ) : (
          <View style={[styles.detailImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>PLAYZONE</Text>
          </View>
        )}
        <Text style={styles.detailTitle}>{location.name}</Text>
        <Text style={styles.locationCategory}>
          {CATEGORIES.find((item) => item.value === location.category)?.label ??
            location.category}
        </Text>
        <Text style={styles.locationPrice}>
          {formatPrice(location.price)} so‘m
        </Text>
        {!!location.phone_number && (
          <Text style={styles.locationPhone}>+998 {location.phone_number}</Text>
        )}
        <Text style={styles.detailDescription}>
          {location.description || "Maskan haqida qo‘shimcha ma’lumot berilmagan."}
        </Text>
      </View>

      <View style={styles.bookingCard}>
        <Text style={styles.sectionTitle}>Bron so‘rovi</Text>
        <Text style={styles.noticeText}>
          Bron so‘rovi yuboriladi. Tasdiqlanmaguncha bron yakuniy hisoblanmaydi.
        </Text>
        {bookingStatus ? (
          <View style={styles.successCard}>
            <Text style={styles.successText}>{bookingStatus}</Text>
          </View>
        ) : (
          <>
            <TextInput
              autoCapitalize="words"
              onChangeText={setCustomerName}
              placeholder="Ism va familiya"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              value={customerName}
            />
            <View style={styles.phoneInputRow}>
              <Text style={styles.phonePrefix}>+998</Text>
              <TextInput
                keyboardType="phone-pad"
                maxLength={9}
                onChangeText={(value) =>
                  setPhoneNumber(value.replace(/\D/g, "").slice(0, 9))
                }
                placeholder="90 123 45 67"
                placeholderTextColor={COLORS.muted}
                style={[styles.input, styles.phoneInput]}
                value={phoneNumber}
              />
            </View>
            <TextInput
              onChangeText={setRequestedDate}
              placeholder="Sana (YYYY-MM-DD)"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              value={requestedDate}
            />
            <TextInput
              onChangeText={setRequestedTime}
              placeholder="Vaqt (HH:MM)"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              value={requestedTime}
            />
            <TextInput
              keyboardType="number-pad"
              onChangeText={setDurationHours}
              placeholder="Davomiyligi (soat)"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              value={durationHours}
            />
            {!!formError && <Text style={styles.errorText}>{formError}</Text>}
            {!!bookingError && (
              <Text style={styles.errorText}>{bookingError}</Text>
            )}
            <Pressable
              accessibilityRole="button"
              disabled={
                isSubmitting ||
                !customerName.trim() ||
                phoneNumber.length !== 9 ||
                !requestedDate ||
                !requestedTime
              }
              onPress={submit}
              style={[
                styles.primaryButton,
                (isSubmitting ||
                  !customerName.trim() ||
                  phoneNumber.length !== 9 ||
                  !requestedDate ||
                  !requestedTime) &&
                  styles.disabledButton,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.primaryButtonText}>So‘rov yuborish</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function LocationCard({ apiBaseUrl, location }) {
  const imageUri = location.image
    ? location.image.startsWith("http")
      ? location.image
      : `${apiBaseUrl}${location.image.startsWith("/") ? "" : "/"}${location.image}`
    : null;

  return (
    <View style={styles.locationCard}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.locationImage} />
      ) : (
        <View style={[styles.locationImage, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>PLAYZONE</Text>
        </View>
      )}
      <View style={styles.locationDetails}>
        <Text numberOfLines={1} style={styles.locationName}>
          {location.name}
        </Text>
        <Text style={styles.locationCategory}>
          {CATEGORIES.find((item) => item.value === location.category)?.label ??
            location.category}
        </Text>
        <Text style={styles.locationPrice}>
          {formatPrice(location.price)} so‘m
        </Text>
        {!!location.phone_number && (
          <Text style={styles.locationPhone}>+998 {location.phone_number}</Text>
        )}
      </View>
    </View>
  );
}

function formatPrice(value) {
  const price = Number(value);
  return Number.isFinite(price)
    ? new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(price)
    : value;
}

const COLORS = {
  background: "#F5F7F2",
  green: "#247A45",
  greenDark: "#14532D",
  greenLight: "#E6F3E9",
  ink: "#17231A",
  muted: "#748078",
  border: "#E6EBE5",
  white: "#FFFFFF",
  error: "#B42318",
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  page: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },
  headerActions: { alignItems: "center", flexDirection: "row", gap: 8 },
  brand: { alignItems: "center", flexDirection: "row", gap: 9 },
  brandMark: {
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  brandMarkText: { color: COLORS.white, fontSize: 20, fontWeight: "800" },
  brandName: { color: COLORS.ink, fontSize: 20, fontWeight: "800" },
  accountButton: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  accountButtonText: { color: COLORS.greenDark, fontSize: 14, fontWeight: "700" },
  hero: { marginBottom: 26 },
  eyebrow: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 12,
  },
  title: { color: COLORS.ink, fontSize: 34, fontWeight: "800", lineHeight: 40 },
  subtitle: { color: COLORS.muted, fontSize: 15, lineHeight: 23, marginTop: 12 },
  loginCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    marginBottom: 25,
    padding: 18,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: { color: COLORS.ink, fontSize: 19, fontWeight: "800" },
  sectionCaption: { color: COLORS.muted, fontSize: 13, marginTop: 4 },
  input: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    color: COLORS.ink,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },
  disabledButton: { opacity: 0.55 },
  errorText: { color: COLORS.error, fontSize: 13, lineHeight: 18 },
  categoryList: { gap: 8, paddingBottom: 18 },
  categoryChip: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  categoryText: { color: COLORS.muted, fontSize: 13, fontWeight: "600" },
  selectedCategoryText: { color: COLORS.white },
  locationList: { gap: 12 },
  locationCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 128,
    padding: 12,
  },
  locationImage: { borderRadius: 12, height: 100, width: 100 },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: COLORS.greenLight,
    justifyContent: "center",
  },
  placeholderText: { color: COLORS.green, fontSize: 10, fontWeight: "800" },
  locationDetails: { flex: 1, gap: 5 },
  locationName: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  locationCategory: { color: COLORS.muted, fontSize: 12 },
  locationPrice: { color: COLORS.greenDark, fontSize: 14, fontWeight: "800" },
  locationPhone: { color: COLORS.muted, fontSize: 12 },
  noticeCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  noticeTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
  noticeText: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  retryButton: { alignSelf: "flex-start", marginTop: 12, paddingVertical: 6 },
  retryButtonText: { color: COLORS.green, fontSize: 14, fontWeight: "700" },
  backButton: { alignSelf: "flex-start", marginBottom: 14, paddingVertical: 4 },
  detailCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
    padding: 16,
  },
  detailImage: {
    alignSelf: "center",
    borderRadius: 14,
    height: 190,
    marginBottom: 8,
    width: "100%",
  },
  detailTitle: { color: COLORS.ink, fontSize: 22, fontWeight: "800" },
  detailDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  phoneInputRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  phonePrefix: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
  phoneInput: { flex: 1 },
  successCard: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 12,
    padding: 14,
  },
  successText: { color: COLORS.greenDark, fontSize: 14, lineHeight: 20 },
  footer: { color: COLORS.muted, fontSize: 12, paddingTop: 25, textAlign: "center" },
});
