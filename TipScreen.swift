
import SwiftUI

struct TipOption: Identifiable {
    let id = UUID()
    let label: String
    let value: Double?
}

struct TipScreen: View {
    @State private var subtotal: String = ""
    @State private var selectedTip: TipOption? = nil
    @State private var customTip: String = ""

    private let tipOptions = [
        TipOption(label: "10%", value: 0.10),
        TipOption(label: "15%", value: 0.15),
        TipOption(label: "20%", value: 0.20),
        TipOption(label: "Custom", value: nil)
    ]

    var subtotalValue: Double {
        Double(subtotal) ?? 0.0
    }

    var tipAmount: Double {
        if selectedTip?.value != nil {
            return subtotalValue * (selectedTip?.value ?? 0.0)
        } else if let custom = Double(customTip) {
            return custom
        }
        return 0.0
    }

    var total: Double {
        subtotalValue + tipAmount
    }

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Enter Subtotal")) {
                    TextField("Subtotal", text: $subtotal)
                        .keyboardType(.decimalPad)
                }

                Section(header: Text("Select Tip")) {
                    ForEach(tipOptions) { option in
                        HStack {
                            Text(option.label)
                            Spacer()
                            if selectedTip?.id == option.id {
                                Image(systemName: "checkmark")
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedTip = option
                        }
                    }

                    if selectedTip?.label == "Custom" {
                        TextField("Enter custom tip", text: $customTip)
                            .keyboardType(.decimalPad)
                    }
                }

                Section(header: Text("Summary")) {
                    HStack {
                        Text("Tip")
                        Spacer()
                        Text("$\(String(format: "%.2f", tipAmount))")
                    }
                    HStack {
                        Text("Total")
                        Spacer()
                        Text("$\(String(format: "%.2f", total))")
                            .bold()
                    }
                }

                Section {
                    Button(action: {
                        sendToBackend(subtotal: subtotalValue, tip: tipAmount, total: total)
                    }) {
                        Text("Confirm Payment")
                            .frame(maxWidth: .infinity, alignment: .center)
                    }
                    .disabled(subtotalValue == 0.0)
                }
            }
            .navigationTitle("Add Tip")
        }
    }

    func sendToBackend(subtotal: Double, tip: Double, total: Double) {
        guard let url = URL(string: "https://sturdy-waddle-com.onrender.com/transactions") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "amount": total,
            "currency": "usd",
            "tip": tip,
            "subtotal": subtotal
        ]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
        } catch {
            print("JSON error: \(error)")
            return
        }

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error: \(error.localizedDescription)")
                return
            }
            print("Payment sent!")
        }.resume()
    }
}

struct TipScreen_Previews: PreviewProvider {
    static var previews: some View {
        TipScreen()
    }
}

@main
struct POSApp: App {
    var body: some Scene {
        WindowGroup {
            TipScreen()
        }
    }
}
