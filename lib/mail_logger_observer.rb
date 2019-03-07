class MailLoggerObserver
  def self.delivered_email(mail)
    puts "[EMAIL] #{mail.to_s.dump}" if not Rails.env.test?
  end
end
