// // Exemple de test pour l'API wallets
// // Ce fichier peut être utilisé pour tester les endpoints

// export const testWalletCreation = async () => {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//   // Exemple de création d'un wallet Ethereum
//   const ethereumWalletData = {
//     name: "Test Wallet ETH",
//     address: "0x1234567890abcdef1234567890abcdef12345678",
//     blockchain: "Ethereum",
//   };

//   try {
//     const response = await fetch(`${baseUrl}/api/wallets`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Note: Vous devrez ajouter un token d'authentification valide
//         // 'Authorization': 'Bearer YOUR_TOKEN'
//       },
//       body: JSON.stringify(ethereumWalletData),
//     });

//     const result = await response.json();
//     console.log("Résultat création wallet ETH:", result);
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la création du wallet:", error);
//     throw error;
//   }
// };

// export const testCentralizedWalletCreation = async () => {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//   // Exemple de création d'un wallet centralisé
//   const centralizedWalletData = {
//     name: "Test Compte Binance",
//     blockchain: "All",
//     exchange: "Binance",
//   };

//   try {
//     const response = await fetch(`${baseUrl}/api/wallets`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Note: Vous devrez ajouter un token d'authentification valide
//         // 'Authorization': 'Bearer YOUR_TOKEN'
//       },
//       body: JSON.stringify(centralizedWalletData),
//     });

//     const result = await response.json();
//     console.log("Résultat création wallet centralisé:", result);
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la création du wallet centralisé:", error);
//     throw error;
//   }
// };

// export const testGetWallets = async () => {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//   try {
//     const response = await fetch(`${baseUrl}/api/wallets`, {
//       method: "GET",
//       headers: {
//         // Note: Vous devrez ajouter un token d'authentification valide
//         // 'Authorization': 'Bearer YOUR_TOKEN'
//       },
//     });

//     const result = await response.json();
//     console.log("Résultat récupération wallets:", result);
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des wallets:", error);
//     throw error;
//   }
// };
